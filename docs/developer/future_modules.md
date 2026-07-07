# Future Architectural Enhancements
### Long-Term Protocol Upgrades

---

## 1. Executive Summary
This document acts as the technical playbook for upcoming developer upgrades. It highlights the planned upgrades designed to improve decentralization, security, and verification across the AIRA Protocol.

---

## 2. Upcoming Upgrades

### I. Multi-Swarm Consensus Engine
*   **Current State**: A single category agent scans data, parses sentiment, and posts market proposals.
*   **Target State**: Upgraded consensus framework. When a signal is ingested, multiple category-specific agents evaluate the trend parameters. A proposal is only dispatched if a majority consensus (e.g., 3 out of 5 agents) agrees on the question boundaries and confidence scoring.
*   **Implementation Path**: Expand the central Event Bus to cache proposals and compile votes before triggering execution.

### II. MPC and Multi-Sig Key Management
*   **Current State**: Deployed contracts require a single administrative wallet signature to commit market proposal transactions.
*   **Target State**: Decentralized key management. Integrate Multi-Party Computation (MPC) nodes or multi-signature smart wallets (e.g. Safe) to sign proposals, removing single-point-of-failure vulnerabilities.
*   **Implementation Path**: Reconfigure contract factories to resolve signatures via MPC provider thresholds.

### III. Zero-Knowledge Reasoning Proofs (ZK-Reasoning)
*   **Current State**: Agents hash raw sentiment inputs to IPFS CIDs to prove their logic.
*   **Target State**: Cryptographic zk-proofs of LLM execution. Agents compile proofs confirming that the sentiment output was calculated using the correct model parameters and confidence heuristics without revealing the proprietary prompt structures.
*   **Implementation Path**: Leverage zk-virtual machine frameworks to compile agent execution proofs.
