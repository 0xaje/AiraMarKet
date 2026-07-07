# AIRA Protocol: System Architecture
### Decoupled Cognitive Ingestion and Immutable Blockchain Settlement

---

## 1. High-Level Architecture

The AIRA Protocol is designed around a strict **Separation of Concerns**. Computational cognitive labor (ingestion feeds, evidence collection, and consensus engine analysis) is separated from economic settlement (asset custody, token distribution, and dispute resolution) to form a robust, verifiable pipeline:

$$\text{Signal} \longrightarrow \text{Evidence Package} \longrightarrow \text{Multi-Agent Analysis} \longrightarrow \text{Consensus Engine} \longrightarrow \text{Decision Proposal} \longrightarrow \text{Human Verification} \longrightarrow \text{GIWA Settlement}$$

By isolating heavy AI computation off-chain, the protocol avoids high gas costs and execution latency. By keeping all asset custody on-chain, user funds remain fully protected by smart contracts; even in the event of an off-chain server crash or AI model hallucination, the integrity of the ledger and user balances is maintained.

```
                  ┌────────────────────────────────────────────────────────┐
                  │              COGNITIVE LAYER (Off-Chain)               │
                  │  ┌───────────┐      ┌───────────┐      ┌────────────┐  │
                  │  │ Ingestion │ ───> │ Evidence  │ ───> │ Multi-Agent│  │
                  │  │   Feeds   │      │  Package  │      │  Consensus │  │
                  │  └───────────┘      └───────────┘      └────────────┘  │
                  └──────────────────────────────────────────────┬─────────┘
                                                                 │(Decision Proposal)
                                                                 ▼
                  ┌──────────────────────────────────────────────┐
                  │            INTEGRATION BUS & CACHE           │
                  │  ┌────────────────┐      ┌────────────────┐  │
                  │  │ Local Event Bus│      │ PostgreSQL DB  │  │
                  │  └───────┬────────┘      └────────▲───────┘  │
                  └──────────┼────────────────────────┼──────────┘
                             │ (Transaction Trigger)  │ (Block Indexing)
                             ▼                        │
                  ┌──────────────────────────┬────────┴──────────┐
                  │            SETTLEMENT LAYER (On-Chain)       │
                  │  ┌────────────────┐      ┌────────────────┐  │
                  │  │ Smart Contract │ <─── │   EVM Ledger   │  │
                  │  └───────┬────────┘      └────────────────┘  │
                  └──────────┼───────────────────────────────────┘
                             │ (User Interactions)
                             ▼
                  ┌──────────────────────────────────────────────┐
                  │             CLIENT LAYER (Browser)           │
                  │  ┌────────────────────────────────────────┐  │
                  │  │            React Web Dashboard         │  │
                  │  └────────────────────────────────────────┘  │
                  └──────────────────────────────────────────────┘
```

---

## 2. Core Services

The protocol relies on several core services, each defined by strict boundaries and design rationales:

### I. Data Ingestion & Evidence Service
*   **Responsibility**: Periodically queries real-world feeds (e.g., news, financials, sports), normalizes raw JSON data, and compiles it into structured **Evidence Packages** (which encapsulate normalized signals, source metadata, timestamps, and confidence inputs).
*   **Service Boundary**: Inputs are external REST APIs; outputs are structured Evidence Packages stored in the persistent database and emitted to the internal event bus.
*   **Why it exists**: Guarantees that every decision proposal is backed by a verifiable record of evidence before entering downstream agent review processes.

### II. AI Sentiment Service (Neural Processor)
*   **Responsibility**: Evaluates Evidence Packages, analyzes sentiment, and generates structured binary (YES/NO) decision proposals.
*   **Service Boundary**: Inputs are Evidence Packages; outputs are structured proposal schemas containing categories, questions, exspiries, and confidence parameters.
*   **Why it exists**: Translates qualitative evidence inputs into quantitative decision proposal parameters.

### III. Multi-Agent Consensus Engine
*   **Responsibility**: Group of specialized verification agents (Analyst, Risk, Compliance) that act as quality gatekeepers by auditing decision proposals against a minimum 0.70 confidence threshold.
*   **Service Boundary**: Inputs are AI proposals; outputs are approved proposals emitted to the administrative queue.
*   **Why it exists**: Filters out low-interest or highly ambiguous proposals before they require human approval or contract gas fees.

### IV. Unified Event Bus
*   **Responsibility**: Acts as the central, asynchronous broker for all off-chain system updates (signals received, decisions proposed, log errors).
*   **Service Boundary**: Acts as an internal publisher-subscriber registry across all Node.js backend processes.
*   **Why it exists**: Decouples the ingestion pipeline, AI agents, and indexing services, preventing synchronous blocking and network lag.

### V. Multi-Chain Registry
*   **Responsibility**: Centralizes provider endpoints, block explorers, and contract ABIs across separate EVM blockchains.
*   **Service Boundary**: Exposes unified loader functions (`ProviderFactory`, `ContractFactory`) to both frontend and backend modules.
*   **Why it exists**: Abstracts differences across multiple L2 networks, allowing the protocol to scale to new chains with zero code changes.

---

## 3. Data Flow

The lifecycle of converting real-world information into an on-chain contract state follows a structured pipeline:

```mermaid
sequenceDiagram
    autonumber
    participant Feed as External Data Feed (Signal)
    participant Ingest as Ingestion Service (Evidence Layer)
    participant Engine as Multi-Agent Consensus Engine
    participant IPFS as IPFS Storage
    participant Admin as Admin Signer (Human Verification)
    participant Contract as L2 Smart Contract (GIWA Settlement)

    Feed->>Ingest: Stream unstructured raw data (Signal)
    Ingest->>Ingest: Normalise & compile Evidence Package
    Ingest->>Engine: Disseminate Evidence Package for Multi-Agent Analysis
    Engine->>Engine: Perform evaluations (Analyst, Risk, Compliance) & quorum check
    Engine->>IPFS: Upload Evidence Package and agent signatures/metadata
    IPFS-->>Engine: Return Content Identifier (IPFS CID)
    Engine->>Admin: Queue approved decision proposal with IPFS CID for human audit
    Admin->>Contract: Sign and dispatch createMarket() transaction (GIWA Settlement)
    Contract->>Contract: Lock 2.0 Native Token seed (50/50 YES/NO pool)
```

---

## 4. Event Flow

To keep the client user interface responsive, on-chain state updates are synchronized to the local cache via an event-driven indexing loop:

```mermaid
sequenceDiagram
    autonumber
    participant User as Web3 User
    participant Contract as L2 Smart Contract
    participant Ledger as EVM Block Ledger
    participant Indexer as Block Indexer
    participant Cache as PostgreSQL Database
    participant Client as React Client UI

    User->>Contract: Submit trade YES/NO transaction
    Contract->>Ledger: Update pool balances & emit TradeRecorded log
    Indexer->>Ledger: Poll block updates via HTTP JSON-RPC
    Ledger-->>Indexer: Return event logs
    Indexer->>Cache: Write transaction state with idempotency checks
    Cache-->>Client: Serve updated decision proposals and portfolio graphs
```

---

## 5. Architectural Tiers

### I. Backend (Cognitive Processing)
*   **Responsibility**: Runs the continuous ingestion scrapers, compiles Evidence Packages, drives the Multi-Agent Consensus Engine, exposes the REST API server, and logs auditable actions to the local filesystem.
*   **Why it exists**: Offloads high-computation AI calculations and database querying from the client browser and the blockchain ledger.

### II. Frontend (User Interface)
*   **Responsibility**: Serves as the user-facing web dashboard. Connects user Web3 wallets, displays active AI-proposed decision proposals, renders real-time pricing curves, and formats transaction notifications.
*   **Why it exists**: Abstracts low-level smart contract functions and database queries into a seamless Web3 dashboard.

### III. Smart Contracts (Settlement Engine)
*   **Responsibility**: Serves as the ultimate trust anchor. Enforces pool ratios, handles YES/NO token minting, holds deposited funds, and locks optimistic dispute bonds.
*   **Why it exists**: Guarantees that asset custody, trade math, and winnings distributions are executed transparently and immune to manipulation.

### IV. Indexer (Blockchain Sync)
*   **Responsibility**: Executes stateless HTTP polling of new blocks, parses transaction logs, and updates the local database.
*   **Why it exists**: Resolves the RPC rate-limit crashes and filter timeouts typical of WebSockets, maintaining stable synchronization between the blockchain and the cached database.

### V. Storage (Persistence Cache)
*   **Responsibility**: Retains structured historical records of market statistics, block checkpoints, and user portfolios.
*   **Why it exists**: The EVM ledger is not optimized for complex queries (such as sorting, filtering, or time-series charting). A relational database provides the performance required for the client UI.

### VI. Infrastructure (Hosting Environment)
*   **Responsibility**: Host systems for the backend API, L2 RPC nodes, IPFS gateways, and static CDNs for browser client hosting.
*   **Why it exists**: Ensures high service availability, secure data pipelines, and low latency.

---

## 6. Future Expansion

The architecture is designed to support three key future enhancements:
1.  **Multi-Engine Consensus**: Upgrading the Consensus Engine to require consensus voting (e.g., 3 out of 5 agents approving a proposal) before it is queued.
2.  **MPC Administrative Signing**: Replacing the single-signature Admin validation with a Multi-Party Computation (MPC) or Multi-Sig threshold structure to eliminate single-point-of-failure vulnerabilities.
3.  **Zero-Knowledge Reasoning Proofs**: Integrating ZK-provers to cryptographically verify that the off-chain AI processed the exact news inputs without revealing proprietary LLM prompts.
