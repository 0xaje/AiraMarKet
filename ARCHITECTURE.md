# AIRA Protocol Architecture
### Powered by GIWA

The **AIRA Protocol** is a production-grade, AI-assisted prediction market protocol built with a multi-chain architecture. It leverages autonomous AI agents to ingest real-world data, generate intelligent prediction markets, and submit them for human approval and on-chain deployment.

---

## 1. System Architecture

The protocol is divided into three core layers:

### 1. Assisted Intelligence Layer (Backend Node.js/TypeScript)
- **Signal Ingestion**: Actively pulls real-time data from external sources:
  - `CRYPTO`: CoinGecko API
  - `TECH`: Hacker News Firebase API
  - `POLITICS`: Reddit (`/r/politics`) JSON Feed
  - `SPORTS`: ESPN API
- **AI Service**: Analyzes the normalized data, evaluates sentiment (`bullish`/`bearish`), generates a structured prediction market title, and calculates a confidence score.
- **Agent Swarm**: Specialized agents (`crypto_agent`, `tech_agent`, etc.) that listen to the `EventBus`, query the AI Service, and enforce a strict `> 0.7` confidence threshold.
- **Market Service**: Broadcasts approved market suggestions to the frontend interface. **(Crucially: It halts and waits for human cryptographic approval, preventing autonomous deployment).**
- **Transparency Logger**: An HTTP endpoint (`:3001`) that receives transaction hashes from the frontend and securely logs the AI's reasoning to a verifiable local file (`aira_transparency.log`).

### 2. Multi-Chain Abstraction Layer
- **Chain Configuration Module (`/config/chains`)**: Centralized network parameters (`types.ts`, `loader.ts`, `giwa.ts`, `mantle.ts`, `mantleSepolia.ts`) loaded dynamically. Environment variables override defaults.
- **Provider & Contract Factories (`/services`)**: Centralizes Web3 object creation:
  - `ProviderFactory`: Dynamically instantiates and caches ethers `JsonRpcProvider` or future `WebSocketProvider` instances.
  - `ContractFactory`: Dynamically fetches ABIs and contract addresses via the `/deployments` loader, instantiating ready-to-use Ethers `Contract` instances.
- **Deployment Loader (`/deployments`)**: Holds contract deployments by chain ID (e.g. `deployments/5003/AiraMarketProtocol.ts`).

### 3. On-Chain Settlement Layer (Solidity)
- **AiraMarketProtocol.sol**: A highly gas-optimized smart contract containing both Market Factory and Trading logic.
- Uses strict struct variable packing (combining `address` and `bool` flags) to ensure the `Market` struct fits perfectly within 32-byte storage slots, minimizing L2 deployment costs.
- Secures all liquidity pools (`yesShares` and `noShares`) and manages proportional, math-verified `redeemWinnings` payouts.

### 4. Frontend Interface (React / Web3)
- **Frontend Network Layer (`/src/lib/network`)**: Unifies RainbowKit and Wagmi configurations. Configures custom Viem chains dynamically using properties from the active chain config. Exposes react-ready helpers like `getContractAddress()`, `getTxExplorerUrl()`, and `getNativeCurrencySymbol()`.
- **Dynamic UI**: Renders live markets directly from the blockchain by aggressively polling `contract.listMarkets()`.
- **Web3 Integration**: Integrates directly with `wagmi` to prompt wallet connections.
- **Market Execution**: Allows users to dynamically purchase YES/NO shares, which triggers physical on-chain transactions.
- **Positions Dashboard**: Calculates real-time user holdings directly from the contract state.

---

## 2. Data Flow (End-to-End)

1. **Ingestion**: `signal_ingestion.ts` hits external APIs, normalizes JSON, and emits a `SIGNAL_RECEIVED` event.
2. **Analysis**: `tech_agent.ts` captures the event and queries `ai_service.ts`. The AI creates a structured proposal.
3. **Suggestion**: If `confidence > 0.7`, it emits `MARKET_SUGGESTED` (awaiting human input).
4. **Human Approval**: A protocol administrator views the suggestion in the React UI (`App.jsx`) and clicks **Launch On-Chain**.
5. **Deployment**: MetaMask prompts the user to sign the `createMarket` transaction using the native gas token.
6. **Transparency Log**: The frontend receives the `txHash` and POSTs it back to the backend `TransparencyLogger`, binding the cryptographic proof to the AI's reasoning log.
7. **Trading Live**: The market instantly appears in the Live Feed, allowing global users to buy YES/NO positions.

---

## 3. Protocol Security & Guidelines

- **No Autonomous Trading**: AI is strictly an **assisted** layer. No on-chain state changes occur without cryptographic signatures from connected wallets.
- **Gas Optimized**: Heavy usage of `calldata` and storage variable packing guarantees low-fee operation on EVM chains.
- **Oracle Independence**: The resolution (`resolveMarket`) is currently restricted via `onlyOwner`. Future upgrades will distribute this to a decentralized oracle network or multi-sig.
