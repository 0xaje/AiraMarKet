# AIRA Protocol
### The Autonomous Intelligence & Risk Analysis Protocol — Powered by GIWA

---

## 1. Executive Summary

### Why This Exists
In traditional prediction and information markets, market creation and resolution suffer from high operational friction, reliance on centralized actors, and low engagement. The **AIRA Protocol** represents an autonomous, AI-driven infrastructure engineered to programmatically ingest real-world data, formulate prediction markets, and settle outcomes trustlessly.

### What Problem It Solves
Traditional platforms suffer from the "cold start" liquidity problem and opaque resolution rules. The AIRA Protocol resolves these issues by introducing:
1. **Automated Market Formulation**: Background AI swarms constantly analyze public data streams, translating emerging trends into structured, binary options.
2. **Cold-Start Liquidity Balancing**: A mathematically balanced initial seed mechanism stabilizes trading curves from block zero.
3. **Decentralized Verification**: Every suggestion packages its underlying data signals and AI reasoning into a cryptographically anchored IPFS payload, ensuring full transparency.

### Why It Matters
By removing human coordination bottlenecks in market generation and oracle settlements, the AIRA Protocol establishes a highly efficient, trustless, and scalable prediction framework. It demonstrates how autonomous agents can securely interact with decentralized state machines without introducing custody risks.

### How It Benefits GIWA
As the flagship network hosting the protocol, Dunamu's **GIWA OP Stack L2** directly benefits in the following ways:
- **Transaction Velocity**: The protocol generates continuous on-chain trading volumes and gas consumption through agent actions and global user participation, proving GIWA's high throughput capabilities.
- **Showcasing L2 Efficiency**: By utilizing GIWA's ultra-low transaction fees, the protocol executes complex state updates (e.g. pool adjustments, reward redemptions) cost-effectively, highlighting GIWA as the premier L2 network for microtransaction-heavy applications.
- **Verifiable AI Proofs**: Proving AI reasoning on-chain requires low-latency transaction confirmation, which is natively achieved through GIWA's rapid block confirmation cycle.

---

## 2. Core Value Propositions & Architectural Design

### 1. Verifiable AI (IPFS Anchoring)
The protocol implements a cryptographically verifiable AI reasoning flow. When an agent proposes a market, the raw reasoning data (e.g. sentiment score, sources, metrics) is packaged into a JSON schema, hashed, and anchored on-chain as an `_ipfsCID` during contract execution. This guarantees that the reasoning behind every market is permanently auditable.

### 2. Cold-Start Pari-Mutuel Liquidity
To bypass the early liquidity imbalances that plague peer-to-peer prediction curves, the protocol implements a mandatory native liquidity seed. Upon creation, 2.0 native tokens are deposited and split 50/50 between the YES and NO pools. This establishes a stable starting price point on the bonding curve before any user interaction occurs.

### 3. Optimistic slashee-bonded Settlement
Market resolution is governed by a decentralized optimistic oracle design. Proposers submit outcomes along with a 10 native token slashing bond. This bond is subject to dispute challenges, ensuring that actors are economically incentivized to report truthful outcomes.

---

## 3. Technology Stack

*   **Smart Contracts:** Solidity, Hardhat, Ethers.js v6
*   **Blockchain Ledger:** Flagship GIWA Network (supporting multi-chain EVM configurations for Mantle)
*   **Indexer Engine:** Node.js, Prisma, PostgreSQL
*   **AI Swarm Ingestion:** Node stream scrapers, OpenAI/Anthropic APIs
*   **Client Interface:** React, Vite, TailwindCSS, Zustand
*   **Web3 Integration:** Wagmi, Viem, RainbowKit

---

## 4. Network Deployment Configurations

The protocol is modularized to support multiple EVM networks out-of-the-box, with **GIWA Sepolia Testnet** serving as the default flagship deployment.

### Flagship Deployment (GIWA Sepolia)
- **AiraMarketProtocol Contract:** `0xAA277CCB8cDa72D652CdcA4df09df5f2522fc846`
- **Chain ID:** `91342`
- **Block Explorer:** [sepolia-explorer.giwa.io](https://sepolia-explorer.giwa.io/address/0xAA277CCB8cDa72D652CdcA4df09df5f2522fc846)

### Alternate Deployment (Mantle Sepolia)
- **AiraMarketProtocol Contract:** `0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`
- **Chain ID:** `5003`
- **Block Explorer:** [explorer.sepolia.mantle.xyz](https://explorer.sepolia.mantle.xyz/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846)

---

## 5. Startup Quickstart Playbook

### Installation
1. Clone the protocol repository:
   ```bash
   git clone https://github.com/0xaje/AiraMarKet.git
   cd AiraMarKet
   ```
2. Install standardized package dependencies:
   ```bash
   npm install
   ```
3. Initialize the backend database schema and start the indexer:
   ```bash
   npm run server
   ```
4. Start the client dev server:
   ```bash
   npm run dev
   ```
   The client interface will reside at `http://localhost:5173`.