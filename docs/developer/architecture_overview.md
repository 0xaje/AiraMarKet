# Architecture Overview

AIRA Markets is a prediction market protocol built using a modular, chain-agnostic Web3 design.

## System Architecture

```mermaid
graph TD
  SignalIngestion[Signal Ingestion Service] -->|Emit Event| EventBus[Event Bus]
  EventBus -->|Listen| AgentSwarm[Autonomous AI Agent Swarm]
  AgentSwarm -->|Evaluate Sentiment| AIService[AI Intelligence Service]
  AgentSwarm -->|Submit Proposal| MarketCache[Market Database Cache]
  MarketCache -->|Read Cache| Frontend[React Client UI]
  Frontend -->|Cryptographic User Signature| EVMLedger[(EVM Blockchain Ledger)]
  Indexer[Real-time Block Indexer] -->|Poll Blocks| EVMLedger
  Indexer -->|Sync state| DB[(PostgreSQL Database)]
  Frontend -->|Query Portfolio & History| DB
```

### 1. On-Chain Settlement Layer (Solidity Contracts)
- Managed by `AiraMarketProtocol.sol`.
- Implements market creation pooling, YES/NO token balance tracking, optimistic resolution, and proportional rewards redemption.

### 2. Provider & Contract Factories (`/services`)
- **ProviderFactory**: Caches JSON-RPC providers, manages connection latency logs, and executes connection retries.
- **ContractFactory**: Resolves deployment contracts dynamically, checks address formatting, loads corresponding ABIs, and returns instantiated `ethers.Contract` objects.

### 3. Backend Agent Layer (`/server`)
- **Signal Ingestion**: Periodically streams data feeds from HackerNews, ESPN, CoinGecko, and Reddit.
- **AI Sentiment Engine**: Formulates prediction titles and outputs confidence ratings based on trend volumes.
- **Diagnostics Validation**: Assures that RPC, database, files, and wallet keys are healthy on boot.
