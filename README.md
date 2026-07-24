# AIRA Protocol
### A Transparent Multi-Agent Decision Protocol demonstrated through Prediction Markets on GIWA.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](file:///home/oyeolorun/AiraMarKet/LICENSE)
[![GIWA Sepolia](https://img.shields.io/badge/Ecosystem-GIWA_Sepolia-blue.svg)](https://sepolia-explorer.giwa.io)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](file:///home/oyeolorun/AiraMarKet/docs/developer/local_development.md)
[![Solidity](https://img.shields.io/badge/Language-Solidity-lightgrey.svg)](file:///home/oyeolorun/AiraMarKet/contracts/AiraMarket.sol)

AIRA Protocol enables transparent AI-assisted decision workflows by combining multi-agent review, structured evidence, human approval, and on-chain execution on GIWA.

> [!IMPORTANT]
> **Core Value Proposition**  
> *"AIRA doesn't ask users to trust AI. It gives them the tools to inspect how AI reached a decision before that decision is committed on-chain."*

---

> [!NOTE]
> **30-Second Summary**  
> AIRA is a transparent multi-agent decision protocol demonstrated through prediction markets. Multiple specialized AI agents perform specialized analysis using distinct evaluation roles, produce transparent reasoning, pass multi-agent review, and upload structured evidence packages to IPFS, with the resulting Content Identifier (CID) referenced by the smart contract during market creation. Rather than relying on opaque AI outputs, AIRA exposes the reasoning, supporting evidence, and review pipeline behind every approved market before it is executed on GIWA.

| Parameter | Status / Details |
| :--- | :--- |
| **Network** | GIWA Sepolia Testnet (Chain ID: `91342`) |
| **Deployment** | Verified (`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`) |
| **Explorer** | Available ([GIWA Explorer](https://sepolia-explorer.giwa.io)) |
| **Wallet Stack** | RainbowKit / Wagmi / Viem |
| **Status** | Active on GIWA Sepolia (Live MVP) |

---

## What Makes AIRA Different?

Unlike traditional platforms that rely on manual market creation or opaque AI systems, AIRA combines:

- **Multi-agent AI reasoning** instead of a single AI response.
- **Structured evidence packages** stored on IPFS and referenced on-chain.
- **On-chain verification through GIWA** for settlement and auditability.
- **Human approval required before on-chain market creation.**

This approach makes AI-assisted prediction markets transparent, inspectable, and verifiable.

---

## Why AI?

Real-world events emerge faster than traditional prediction markets can be created manually. AIRA uses AI to assist with evidence collection, proposal generation, and structured reasoning, while preserving human oversight and transparent verification before execution on GIWA.

### Why This Matters Now

As AI becomes increasingly involved in decision-making, users need systems that explain how conclusions were reached—not just the conclusions themselves. AIRA provides that transparency by combining AI reasoning, human oversight, and on-chain verification.

### Why This MVP Matters

AIRA demonstrates that AI-assisted decision making can be transparent rather than opaque. Instead of replacing human judgment, the protocol structures AI analysis into an inspectable review pipeline where supporting evidence, human approval, and on-chain execution remain visible throughout the decision lifecycle.

### Why AI Computation is Off-Chain

AIRA intentionally separates AI computation from blockchain execution. Computationally intensive reasoning occurs off-chain, while only the resulting evidence reference, proposal metadata, and settlement logic are committed on GIWA. This minimizes execution costs while preserving auditability and deterministic settlement.

---

## Why This Architecture Fits GIWA

- **Low Gas Costs**: Enables frequent market creation, administrative signing, and micro-trade execution without high cost barriers.
- **Fast Confirmations**: Rapid L2 block times improve prediction market UX and transaction finality.
- **EVM Tooling Compatibility**: Simplifies smart contract deployment, viem/wagmi integration, and RPC indexer synchronization.
- **Transparent Ledger**: Immutable on-chain state complements off-chain AI analysis for complete decision auditability.

---

## Protocol Principles

- **Human approval is required before on-chain market creation.**
- **AI assists rather than autonomously executes.**
- **Every market is supported by inspectable evidence.**
- **Settlement is transparent and verifiable on GIWA.**
- **The protocol is designed for extensibility across pluggable AI providers.**

---

## Security Model

- **Human approval required** before on-chain deployment.
- **AI outputs are reviewable** before execution.
- **Evidence packages are content-addressed via IPFS** and referenced on-chain.
- **Smart contract settlement is deterministic** on GIWA.
- **Dispute resolution follows an optimistic challenge model**.

---

## Technical Architecture (Five-Layer Modular Architecture)

`AI Layer` ➔ `Review Pipeline` ➔ `Evidence Layer` ➔ `Settlement Layer` ➔ `Application Layer`

1. **AI Layer**: Supports configurable LLM providers through an abstraction layer, with deterministic fallback logic when external AI services are unavailable.
2. **Review Pipeline**: Coordinates Analyst, Risk, and Compliance evaluations before determining whether a proposal satisfies the configured approval threshold.
3. **Evidence Layer**: Normalizes real-world signal feeds into deterministic JSON payloads pinned to IPFS CIDs.
4. **Settlement Layer**: Manages market creation, pre-seeded liquidity, trading, optimistic dispute resolution, and payouts on GIWA Sepolia (`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`).
5. **Application Layer**: Delivers a responsive 7-module interface for signal creation, interactive trading, and decision audit interfaces.

---

## End-to-End Decision Lifecycle

```
External Signal ➔ Signal Normalization ➔ Multi-Agent Review ➔ Evidence Package ➔ Human Approval ➔ IPFS Storage ➔ GIWA Smart Contract ➔ Prediction Market ➔ Settlement ➔ Claim
```

```mermaid
flowchart TD
    s1[External Real-World Signal] --> s2[Signal Normalization]
    s2 --> s3[Multi-Agent Review Pipeline]
    s3 --> s4[Evidence Package Assembly]
    s4 --> s5[Human Approval Checkpoint]
    s5 --> s6[IPFS CID Storage]
    s6 --> s7[GIWA Smart Contract Deployment]
    s7 --> s8[Prediction Market Active]
    s8 --> s9[Optimistic Dispute Resolution]
    s9 --> s10[Winnings Claim]
```

---

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Zustand
- **Web3 Integrations**: Wagmi v2, Viem, RainbowKit
- **Backend API & Indexer**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Smart Contracts**: Solidity, Hardhat, Ethers.js v6
- **Storage**: IPFS Content Identifiers (CIDs)
- **Network**: GIWA Sepolia L2 Testnet (Chain ID: `91342`)

---

## Features
*   **Decoupled Cognitive Layer**: Isolates intensive AI computations off-chain while anchoring custody and execution rules securely on-chain.
*   **First Reference Application (AIRA Markets)**: The flagship prediction and risk market application built on the protocol, demonstrating agent-driven creation and optimistic resolution of binary decision pools.
*   **Pre-Seeded Liquidity Pools**: Pre-seeded liquidity minimizes initial pricing distortion during early market participation.
*   **Vibrant Interface**: A mobile-responsive React dashboard featuring Web3 wallet connectors (Wagmi/RainbowKit) and direct explorer notifications.
*   **Fault-Tolerant Indexer**: Relies on stateless polling to eliminate WebSocket disconnections and node rate-limit crashes.

---

## Current MVP Metrics

| Metric | Current MVP |
| :--- | :--- |
| **Smart Contract** | Live on GIWA Sepolia (`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`) |
| **Unit Tests** | 9/9 Passing (`npx hardhat test`) |
| **Integration Tests** | 5/5 Passing (`npm run test:consensus`) |
| **Application Modules** | 7 Production Modules |
| **AI Review Roles** | 3 Specialized Roles (Analyst, Risk, Compliance) |
| **Wallet Integrations** | RainbowKit / Wagmi v2 / Viem |
| **Evidence Layer** | Content-Addressed IPFS CIDs |
| **Settlement Layer** | GIWA Sepolia Testnet |
| **Mobile Support** | Fully Responsive |

---

## Current MVP Limitations

- AI quality depends on the configured LLM provider.
- Human approval is required before market deployment.
- Agent reputation and calibration history are not yet persisted across long-term operation.
- Governance remains application-managed during the testnet phase.

---

## Protocol Verification Metrics

The following metrics represent verified protocol capabilities and testing outcomes:
*   **Infrastructure & Integration**:
    *   `[x]` Multi-chain architecture configuration
    *   `[x]` Dunamu's GIWA Sepolia Testnet integration verified
    *   `[x]` Production diagnostics & health monitoring active
    *   `[x]` Standardized structured logging implemented
*   **Consensus & Intelligence**:
    *   `[x]` Multi-Agent Review Pipeline implemented
    *   `[x]` Three specialized AI agent roles (Analyst, Risk, Compliance) active
    *   `[x]` Collaborative quorum thresholds implemented (66% approval quorum)
    *   `[x]` Agent evaluation reasoning persisted in database cache
*   **Code Quality & Verification**:
    *   `[x]` Live Deployment Status: Active on GIWA Sepolia Testnet
    *   `[x]` 9/9 smart contract unit tests passing
    *   `[x]` 5/5 decision pipeline integration tests passing
    *   `[x]` Production frontend build compiled and verified

> **AIRA Protocol demonstrates how AI-assisted analysis, transparent evidence, human oversight, and deterministic smart contract execution can be combined into a practical, end-to-end decision workflow on GIWA. By separating computational reasoning from on-chain settlement, the protocol preserves transparency, minimizes execution costs, and provides an extensible foundation for future AI-assisted decentralized applications.**

---

## Resources

- **GitHub Repository**: [0xaje/AiraMarKet](https://github.com/0xaje/AiraMarKet)
- **Live MVP Application**: [AIRA Protocol App](https://airamarket.vercel.app)
- **Smart Contract Address**: [`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`](https://sepolia-explorer.giwa.io/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846)
- **Block Explorer**: [GIWA Sepolia Explorer](https://sepolia-explorer.giwa.io)
- **Documentation Hub**: [Executive Overview](file:///home/oyeolorun/AiraMarKet/docs/EXECUTIVE_OVERVIEW.md)

---

## License
This project is licensed under the MIT License. See [LICENSE](file:///home/oyeolorun/AiraMarKet/LICENSE) for more details.