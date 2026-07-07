# AIRA Protocol
### The Autonomous Intelligence & Risk Analysis Protocol

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](file:///home/oyeolorun/AiraMarKet/LICENSE)
[![GIWA L2](https://img.shields.io/badge/Ecosystem-GIWA_L2-blue.svg)](https://sepolia-explorer.giwa.io)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](file:///home/oyeolorun/AiraMarKet/docs/developer/local_development.md)
[![Solidity](https://img.shields.io/badge/Language-Solidity-lightgrey.svg)](file:///home/oyeolorun/AiraMarKet/contracts/AiraMarket.sol)

---

## Tagline
An autonomous, verifiable, agent-driven prediction market protocol running natively on high-performance EVM networks.

---

## Mission
To automate and scale prediction market ecosystems by replacing manual curation and slow, centralized oracle settlements with autonomous, cryptographically auditable AI agent heuristics on high-performance Layer 2 chains.

---

## Architecture Diagram

The AIRA Protocol decouples decision-making intelligence from smart contract state settlement to guarantee absolute capital safety:

```mermaid
graph TD
    subgraph Data Ingestion Layer
        DS[Data Feeds] --> Ingest[Ingestion Pipeline]
    end
    subgraph Autonomous Agent Layer
        Ingest --> Agents[Agent Swarms]
        Agents -->|"Confidence Heuristics (> 0.70)"| Proposal[Market Proposal]
    end
    subgraph EVM Ledger & Indexing
        Proposal -->|"Admin Signature Verification"| GIWA[GIWA Sepolia L2 Ledger]
        GIWA -->|"On-Chain Event Logs"| Indexer[Stateless HTTP Indexer]
    end
    subgraph Relational Cache & Frontend
        Indexer --> DB[(PostgreSQL Database)]
        Client[React Client UI] -->|Reads| DB
        Client -->|State Transactions| GIWA
    end
end
```

---

## Core Components

The protocol is comprised of five main layers:
1.  **Autonomous Agent Swarms**: Specialized AI agents (`CryptoAgent`, `TechAgent`, `SportsAgent`) that scan news feeds and sentiment vectors to identify high-interest markets.
2.  **Smart Contract Settlement Engine (`AiraMarketProtocol.sol`)**: An optimized Solidity execution layer governing pari-mutuel share ratios, YES/NO token minting, pool rebalancing, and payout claims.
3.  **Cryptographic Verification (IPFS Anchoring)**: Every proposed market hashes its raw inputs, sentiment scoring, and decision metrics into a JSON metadata payload anchored directly on-chain during execution.
4.  **Optimistic Oracle Settlements**: conclusive resolution is determined via economic incentives; outcome proposers stake a slashing bond, subject to verification challenges.
5.  **Stateless Block Indexer**: A database ingestion pipeline that monitors the ledger via HTTP JSON-RPC polling, using transaction-level database idempotency to maintain absolute sync alignment.

---

## Why GIWA

Dunamu's **GIWA OP Stack L2** network serves as the protocol's flagship execution environment:
*   **Sub-Penny Execution Costs**: Enables AI agents to run continuous pool rebalancing and micro-trades without high gas fees.
*   **Low Block Times**: Offers near-instantaneous transaction validation, ensuring user trades and contract creations are confirmed with sub-second finality.
*   **Cost-Effective Auditing**: Makes the on-chain anchoring of dense IPFS reasoning payloads viable, creating complete transparency for all prediction markets.

---

## Features
*   **Automatic Market Formulation**: Continual, algorithmic creation of trending binary options.
*   **Pre-Seeded Liquidity Pools**: Contract-enforced native token seeding (2.0 tokens split 50/50) to prevent early-trader curve manipulation.
*   **Vibrant Interface**: A mobile-responsive React dashboard featuring Web3 wallet connectors (Wagmi/RainbowKit) and direct explorer notifications.
*   **Fault-Tolerant indexer**: Relies on stateless polling to eliminate WebSocket disconnections and node rate-limit crashes.

---

## Technology Stack
*   **Smart Contracts**: Solidity, Hardhat, Ethers.js v6
*   **Blockchain Ledger**: Flagship GIWA Sepolia L2 Network (supporting multi-chain EVM config for Mantle)
*   **Indexer & Data Pipeline**: Node.js, Prisma ORM, PostgreSQL
*   **Client Interface**: React, Vite, TailwindCSS, Zustand
*   **Web3 Integrations**: Wagmi, Viem, RainbowKit

---

## Quick Start

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL running database instance

### Setup
1.  Clone the protocol repository:
    ```bash
    git clone https://github.com/0xaje/AiraMarKet.git
    cd AiraMarKet
    ```
2.  Install standardized package dependencies:
    ```bash
    npm install
    ```
3.  Initialize environment configurations (`.env`):
    ```bash
    PRIVATE_KEY="0x..."
    DATABASE_URL="postgresql://..."
    RPC_URL="https://sepolia-rpc.giwa.io"
    ```
4.  Synchronize the PostgreSQL schemas and boot the server/indexer:
    ```bash
    npx prisma db push
    npm run server
    ```
5.  Start the client development server:
    ```bash
    npm run dev
    ```
    The React UI will run at `http://localhost:5173`.

---

## Repository Structure
```
├── config/                 # Core network and protocol settings registries
├── contracts/              # Solidity source contracts
├── deployments/            # Chain-specific deployment addresses and ABIs
├── docs/                   # Developer guides and executive reports
├── scripts/                # Hardhat deployment and validation tasks
├── server/                 # AI agents, event buses, and block indexers
├── services/               # Multi-chain provider and contract factories
├── src/                    # Client React dashboard components
└── test/                   # Smart contract unit tests
```

---

## Roadmap
*   **Phase 1 (Completed)**: Core smart contract validation, local sandbox development, agent swarms implementation, testnet deployment, and event indexer hardening.
*   **Phase 2 (Q3 2026)**: Deploying the backend to remote hosting, upgrading to production AI APIs, and launching the public sandbox on GIWA Sepolia.
*   **Phase 3 (Q4 2026)**: Deploying to GIWA Mainnet, integrating third-party decentralized oracle networks, and initiating liquidity provider incentives.
*   **Phase 4 (Q1 2027)**: Transitioning protocol parameters (fee splits, confidence thresholds) to a Decentralized Autonomous Organization (DAO) and releasing developer SDKs to allow partners to build custom AI agents.

---

## Documentation
*   [Executive Overview](file:///home/oyeolorun/AiraMarKet/docs/EXECUTIVE_OVERVIEW.md)
*   [Architecture Overview](file:///home/oyeolorun/AiraMarKet/docs/developer/architecture_overview.md)
*   [Local Development Guide](file:///home/oyeolorun/AiraMarKet/docs/developer/local_development.md)
*   [Production Deployment Guide](file:///home/oyeolorun/AiraMarKet/docs/developer/deployment_guide.md)
*   [Diagnostics & Troubleshooting Playbook](file:///home/oyeolorun/AiraMarKet/docs/developer/troubleshooting.md)
*   [Multi-Chain Abstraction Playbook](file:///home/oyeolorun/AiraMarKet/docs/developer/adding_new_chains.md)
*   [AI Agent Swarm Integration Guide](file:///home/oyeolorun/AiraMarKet/docs/developer/adding_new_ai_agents.md)
*   [Coding Standards & Workflow](file:///home/oyeolorun/AiraMarKet/docs/developer/standards.md)
*   [Future Enhancements Playbook](file:///home/oyeolorun/AiraMarKet/docs/developer/future_modules.md)

---

## Contributing
We welcome contributions to the AIRA Protocol. Please read our [Local Development Guide](file:///home/oyeolorun/AiraMarKet/docs/developer/local_development.md) and [Coding Standards & Workflow](file:///home/oyeolorun/AiraMarKet/docs/developer/standards.md) to set up your environment. Ensure that all modifications pass the Hardhat unit tests before opening a Pull Request:
```bash
npx hardhat test
```

---

## License
This project is licensed under the MIT License. See [LICENSE](file:///home/oyeolorun/AiraMarKet/LICENSE) for more details.