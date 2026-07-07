# System Architecture Overview
### Technical Design & Core Boundaries

---

## 1. High-Level Architecture Design
The AIRA Protocol splits functionality into a decoupled design:
*   **Off-Chain Cognitive Processing**: AI agent swarms process data scrapers, news trends, and confidence scores. By keeping heavy computations off-chain, the system runs with sub-second performance.
*   **On-Chain State Settlement**: Smart contracts govern all custody, tokens, and payouts. This guarantees safety of user funds even if the off-chain system experiences downtime.

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  Data Ingestion Tier   │ ───> │  Cognitive Swarm Tier  │ ───> │ Integration Event Bus  │
└────────────────────────┘      └────────────────────────┘      └───────────┬────────────┘
                                                                            │
                                                                            ▼
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  Vite React Client UI   │ <─── │ Relational SQL Cache   │ <─── │ Stateless Block Indexer│
└────────────────────────┘      └────────────────────────┘      └───────────▲────────────┘
            │                                                               │
            │ (User Transaction)                                            │ (Poll Logs)
            ▼                                                               │
┌───────────────────────────────────────────────────────────────────────────┴────────────┐
│                              EVM L2 Ledger (GIWA Network)                              │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Service Boundaries & Responsibilities

### I. Data Ingestion Service
*   **Responsibility**: Queries raw APIs (Reddit, Hacker News, ESPN, CoinGecko) and normalizes JSON payloads.
*   **Boundary**: Inputs: external endpoints. Outputs: normalized event signals emitted to the Event Bus.
*   **Rationale**: Decouples external API updates from agent reasoning logic.

### II. AI Sentiment Service
*   **Responsibility**: Analyzes sentiment vectors and structures binary prediction proposals.
*   **Boundary**: Inputs: normalized signals. Outputs: structured market proposal objects.
*   **Rationale**: Translates qualitative source texts into quantitative market structures.

### III. Cognitive Agent Swarms
*   **Responsibility**: Specialized agents verify AI proposals against confidence parameters (> 0.70).
*   **Boundary**: Inputs: structured proposals. Outputs: verified proposals.
*   **Rationale**: Prevents weak or low-interest markets from reaching execution pipelines.

### IV. Smart Contracts
*   **Responsibility**: State registry of markets, token pools, and dispute resolution.
*   **Boundary**: Inputs: signed transactions. Outputs: state logs and transaction receipts.
*   **Rationale**: Serves as the ultimate trust anchor for user capital.

### V. Indexer & SQL Cache
*   **Responsibility**: Stateless polling of EVM block receipts and caching events to a PostgreSQL DB.
*   **Boundary**: Inputs: RPC log events. Outputs: relational database states queried by the UI.
*   **Rationale**: Prevents heavy RPC querying from the frontend dashboard.
