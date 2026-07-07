# System Architecture Overview
### Technical Design & Core Boundaries

---

## 1. High-Level Architecture Design
The AIRA Protocol splits functionality into a decoupled design:
*   **Off-Chain Cognitive Processing**: The Ingestion Feed gathers real-world signals, compiling them into **Evidence Packages** which are audited via Multi-Agent Analysis in the Multi-Agent Consensus Engine.
*   **On-Chain State Settlement**: Smart contracts govern all custody, tokens, and payouts. This guarantees safety of user funds even if the off-chain system experiences downtime.

```
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  Data Ingestion Tier   │ ───> │     Evidence Layer     │ ───> │ Consensus Engine Tier  │ ───> │ Integration Event Bus  │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘      └───────────┬────────────┘
                                                                                                            │
                                                                                                            ▼
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  Vite React Client UI   │ <─── │ Relational SQL Cache   │ <─── │ Stateless Block Indexer│ <─── │   EVM L2 Settlement    │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

The system flow follows a strict 7-stage architectural progression:
$$\text{Signal} \longrightarrow \text{Evidence Package} \longrightarrow \text{Multi-Agent Analysis} \longrightarrow \text{Consensus Engine} \longrightarrow \text{Decision Proposal} \longrightarrow \text{Human Verification} \longrightarrow \text{GIWA Settlement}$$

---

## 2. Service Boundaries & Responsibilities

### I. Data Ingestion & Evidence Layer Service
*   **Responsibility**: Queries raw APIs (Reddit, Hacker News, ESPN, CoinGecko), normalizes JSON payloads, and builds **Evidence Packages** (linking normalized signal feeds, source metadata, timestamps, and confidence inputs).
*   **Boundary**: Inputs: external endpoints. Outputs: structured Evidence Packages stored in the database cache.
*   **Rationale**: Ensures all decision proposals have an immutable record of primary source evidence before agent evaluations.

### II. AI Sentiment Service
*   **Responsibility**: Analyzes sentiment vectors on Evidence Packages and structures binary decision proposals.
*   **Boundary**: Inputs: Evidence Packages. Outputs: structured decision proposal objects.
*   **Rationale**: Translates qualitative source texts and metadata into quantitative risk parameters.

### III. Multi-Agent Consensus Engine
*   **Responsibility**: Performs Multi-Agent Analysis, evaluating semantic alignment, checking temporal feasibility, assessing content safety, and verifying consensus thresholds.
*   **Boundary**: Inputs: structured proposals and Evidence Packages. Outputs: consensus-approved proposals.
*   **Rationale**: Prevents weak, insecure, or policy-violating proposals from reaching execution pipelines.

### IV. Smart Contracts
*   **Responsibility**: Core state registry, pool distributions, and final settlement on the GIWA Network.
*   **Boundary**: Inputs: signed transactions verified by admin keys. Outputs: state logs and transaction receipts.
*   **Rationale**: Serves as the ultimate trust anchor for user capital.

### V. Indexer & SQL Cache
*   **Responsibility**: Stateless polling of EVM block receipts and caching events to a PostgreSQL DB.
*   **Boundary**: Inputs: RPC log events. Outputs: relational database states queried by the UI.
*   **Rationale**: Prevents heavy RPC querying from the frontend dashboard.
