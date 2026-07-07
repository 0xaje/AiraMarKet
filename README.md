# AIRA Protocol
### Powered by GIWA

The **AIRA Protocol** is a chain-agnostic, autonomous, decentralized prediction market system powered by the flagship **GIWA Network** and fully compatible with other EVM chains (such as Mantle). Background AI agents constantly analyze real-world data to identify highly debated topics and propose them as structured YES/NO markets. When a user approves an AI suggestion, a smart contract is instantly deployed to the blockchain ledger, allowing users globally to trade YES or NO shares directly from their wallets. 

The system converts live data signals into structured on-chain markets. Users retain 100% custody of their capital, and all outcomes are resolved transparently through smart contracts. Every transaction, including the raw AI reasoning (via IPFS), is permanently recorded on the blockchain ledger, ensuring full verifiability and trustless settlement.

---

## Key Architecture & Innovations

### 1. Verifiable AI (IPFS Anchors)
Prediction markets cannot rely on "black box" AI. When the AIRA Protocol generates a market, it explicitly packages the real-world signals (e.g., Twitter sentiment, SerpAPI volume) and its raw reasoning into a JSON payload. This payload is hashed and permanently anchored to the EVM blockchain as an `_ipfsCID` during the smart contract creation. **The AI's logic is cryptographically verifiable.**

### 2. The "Cold Start" Pari-Mutuel Solution
Most prediction markets fail because the first trader dictates the entire liquidity curve. The AIRA Protocol natively solves this. During market creation, the deployer must send a mandatory **2.0 Native Token initial liquidity seed** (e.g. GIWA or MNT). The smart contract automatically splits this 50/50 between the YES and NO pools, ensuring the mathematical bonding curve is perfectly balanced before a single human trade occurs.

### 3. Trustless Settlement via Decentralized Oracle
When a market concludes, it is resolved via a Decentralized Optimistic Oracle. Anyone can propose a resolution outcome, but they must stake a **10 Native Token Slashing Bond**. If they lie, their funds are slashed.

### 4. Real-Time Blockchain Event Indexing
The AIRA Protocol features a custom-built real-time event indexer running via Ethers.js and Prisma. It actively monitors the active EVM network's ledger (defaulting to GIWA) for `TradeRecorded` and `WinningsRedeemed` events using JSON-RPC polling, keeping the highly optimized React frontend perfectly synced with the blockchain in real-time. It utilizes transaction-level database idempotency for absolute reliability.

---

## Technology Stack

*   **Smart Contracts:** Solidity, Hardhat, Ethers.js v6
*   **Blockchain:** Flagship GIWA Network (with multi-chain EVM support for Mantle, etc.)
*   **Backend Indexer:** Node.js, Prisma, PostgreSQL
*   **AI Data Ingestion:** Python/Node scrapers, OpenAI/Anthropic APIs
*   **Frontend UI:** React, Vite, TailwindCSS, Zustand
*   **Web3 Wallet Integration:** Wagmi, Viem, RainbowKit

---

## Deployment & Network Configuration

The system is configured to support multiple EVM chains out-of-the-box, with the **GIWA Sepolia Testnet** serving as the default flagship deployment.

### Flagship Deployment (GIWA Sepolia)
- **AiraMarketProtocol Contract:** `0xAA277CCB8cDa72D652CdcA4df09df5f2522fc846`
- **Chain ID:** 91342
- **Block Explorer:** [sepolia-explorer.giwa.io](https://sepolia-explorer.giwa.io/address/0xAA277CCB8cDa72D652CdcA4df09df5f2522fc846)

### Alternate Deployment (Mantle Sepolia)
- **AiraMarketProtocol Contract:** `0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`
- **Chain ID:** 5003
- **Block Explorer:** [explorer.sepolia.mantle.xyz](https://explorer.sepolia.mantle.xyz/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846)

---

## Local Quickstart

### Prerequisites
- Node.js (v18+)
- An EVM RPC URL (GIWA or Mantle)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/0xaje/AiraMarKet.git
cd AiraMarKet
```

2. Install dependencies:
```bash
npm install
```

3. Start the Backend Indexer & Database:
```bash
npm run server
```

4. Start the Frontend Application:
```bash
npm run dev
```

The application will be live at `http://localhost:5173`.