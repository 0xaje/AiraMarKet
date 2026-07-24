# AIRA Protocol — Pitch Deck & Executive Presentation

> **Subheading:** A Transparent Multi-Agent Decision Protocol demonstrated through Prediction Markets on GIWA.  
> **Headline Pitch:** *"AIRA doesn't ask users to trust AI. It gives them the tools to inspect how AI reached a decision before that decision is committed on-chain."*  
> **Network:** GIWA Sepolia Testnet (Chain ID: `91342`)  
> **Contract Address:** [`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`](https://sepolia-explorer.giwa.io/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846)

---

## Slide 1: Title & Vision
* **Header:** AIRA Protocol
* **Sub-Header:** Transparent AI-Assisted Decision Workflows on GIWA
* **Key Visual / Hero Banner:**
  > *"AIRA doesn't ask users to trust AI. It gives them the tools to inspect how AI reached a decision before that decision is committed on-chain."*
* **Core Talking Points:**
  - Standardizing transparent multi-agent reasoning for Web3 workflows.
  - Demonstrated through decentralized decision and prediction markets.
  - Native settlement on GIWA Sepolia Testnet (`Chain ID: 91342`).
  - Verified Smart Contract: `0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`

---

## Slide 2: The Problem
* **Header:** Opaque AI & Trust Deficits in Web3
* **Key Visual:** Comparison between Black-Box AI vs. Trustless Execution Needs.
* **Bullet Points:**
  1. **Black-Box AI Risks:** As AI becomes central to Web3 automation, DApps are forced to rely on single-prompt, opaque AI outputs.
  2. **High Fraud & Manipulation Risk:** Autonomous AI bots executing on-chain without human oversight or audit trails risk severe financial loss.
  3. **Gas Inefficiency:** Running complex AI model inference directly on-chain is computationally impossible or prohibitively expensive on L1/L2 networks.
  4. **The Missing Bridge:** Users need a protocol that provides transparent audit trails *before* any decision is committed to smart contracts.

---

## Slide 3: The Solution
* **Header:** AIRA — Transparent Multi-Agent Decision Protocol
* **Key Visual:** Diagram showing Real-World Signals ➔ Multi-Agent Review ➔ IPFS Evidence CID ➔ Human Approval ➔ GIWA On-Chain Settlement.
* **Bullet Points:**
  1. **Multi-Agent Review Swarm:** Aggregates specialized, independent evaluation roles (Analyst, Risk, Compliance) to analyze evidence before proposal approval.
  2. **Content-Addressed Evidence Anchoring:** Generates structured IPFS evidence packages containing full debate transcripts and logs; logs CIDs directly on-chain.
  3. **Human-First Guardrails:** Human approval checkpoint is strictly required prior to smart contract deployment—AI assists, humans approve.
  4. **Cost-Efficient GIWA Execution:** Off-chain AI reasoning keeps gas costs minimal while leveraging GIWA’s fast, low-cost EVM settlement layer.

---

## Slide 4: Why AI & Why Off-Chain?
* **Header:** Architectural Separation of Reasoning & Settlement
* **Key Visual:** Two-Column Comparison (Off-Chain AI Swarm vs. On-Chain GIWA Execution).
* **Bullet Points:**
  - **Why AI?** Real-world signals (market data, news feeds, chain telemetry) are dynamic and unstructured. Specialized LLM agents normalize these signals into inspectable probability distributions.
  - **Why Off-Chain Computation?** LLM inference requires high memory and matrix math. Running evaluation off-chain avoids gas bloat while preserving cryptographic verification via IPFS CIDs.
  - **Deterministic Fallback:** Configurable LLM provider integration with graceful deterministic fallback logic when API keys are unconfigured, ensuring zero downtime.

---

## Slide 5: The Multi-Agent Review Pipeline
* **Header:** 3 Specialized Roles & 66% Quorum Consensus
* **Key Visual:** Tri-Agent Evaluation Grid.
* **Agent Roles:**
  1. 🔵 **AnalystAgent (Probability Modeling):** Evaluates signal sources, models initial probabilities, and establishes confidence bounds.
  2. 🛡️ **RiskAgent (Volatility Audit):** Audits market depth, tail-risk parameters, and liquidity requirements (~0.000002 GIWA seed).
  3. ⚖️ **ComplianceAgent (Policy & Safety):** Enforces content safety guidelines and protocol policy checks.
* **Consensus Rule:** Proposals require a 66% weighted agent approval quorum before advancing to the Human Approval Checkpoint.

---

## Slide 6: Protocol Architecture & End-to-End Flow
* **Header:** 5-Layer Modular Architecture
* **Key Visual:** Flowchart detailing the 11-step Decision Lifecycle.
* **Architecture Layers:**
  1. **Signal Layer:** Ingests live search trends, sentiment feeds, and chain telemetry.
  2. **Intelligence Layer:** Multi-agent review swarm evaluates signals and generates evidence packages.
  3. **Evidence Storage Layer:** Packages serialized, hashed, and stored on IPFS.
  4. **Human Control Layer:** Human checkpoint verifies evidence and signs transaction via wallet.
  5. **Settlement Layer:** GIWA Sepolia smart contract stores CID, initializes pools, and executes optimistic 2-step resolution.

---

## Slide 7: Live Product & UI Experience
* **Header:** 7 Fully Integrated Production Application Modules
* **Key Visual:** Screenshots of Landing Hero, AI Creator Lab (`/creator`), and Protocol Explorer (`/explorer`).
* **Modules Highlighted:**
  - 🚀 **Landing Hero:** Interactive 11-Step Lifecycle Simulator & Core Value Callout.
  - 🧪 **AI Creator Lab (`/creator`):** Real-time multi-agent debate stream, 66% quorum indicator, and Human Approval Checkpoint.
  - 🔍 **Protocol Explorer (`/explorer`):** 4-Tab Audit Interface (1. Evidence & IPFS CID, 2. Swarm Consensus, 3. On-Chain Settlement, 4. Raw JSON).
  - 🏆 **Decision Registry (`/leaderboard`):** Active agent node calibration & audit histories.

---

## Slide 8: Smart Contract & GIWA Integration
* **Header:** Verified Deployment on GIWA Sepolia Testnet
* **Key Visual:** GIWA Block Explorer Transaction Verification Box.
* **Contract Specification:**
  - **Contract Name:** `AiraMarketProtocol.sol`
  - **Address:** `0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`
  - **Chain ID:** `91342` (GIWA Sepolia Testnet)
  - **Features:** Pari-mutuel trading pools, IPFS CID logging, pre-seeded liquidity support, optimistic 24-hour challenge timelocks.
  - **Verification:** 9 out of 9 Hardhat unit tests passing (`npx hardhat test`), 5 out of 5 consensus pipeline integration tests passing.

---

## Slide 9: MVP Metrics & Verification Roadmap
* **Header:** Empirical Verification & Milestones
* **Metrics Table:**
  | Dimension | Outcome / Status |
  | :--- | :--- |
  | **Smart Contract** | Live on GIWA Sepolia (`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`) |
  | **Hardhat Unit Tests** | `9 / 9` Passing |
  | **Pipeline Integration Tests** | `5 / 5` Passing |
  | **Production Modules** | 7 Live Modules |
  | **Wallet Integration** | RainbowKit / Wagmi v2 / Viem |
  | **Build Status** | Verified Production Build (`vite build`) |
* **Current MVP Limitations:**
  - AI quality is subject to LLM provider limits.
  - Human approval is mandatory for on-chain commits.
  - Governance remains app-managed during testnet phase.

---

## Slide 10: Conclusion & Call to Action
* **Header:** Pioneering Verifiable AI Decision Workflows on GIWA
* **Summary Statement:**
  > *"AIRA Protocol demonstrates how AI-assisted analysis, transparent evidence, human oversight, and deterministic smart contract execution can be combined into a practical, end-to-end decision workflow on GIWA. By separating computational reasoning from on-chain settlement, the protocol preserves transparency, minimizes execution costs, and provides an extensible foundation for future AI-assisted decentralized applications."*
* **Links & Submission Artifacts:**
  - 🌐 **Live Web Application:** [airamarket.vercel.app](https://airamarket.vercel.app)
  - 💻 **GitHub Repository:** [github.com/0xaje/AiraMarKet](https://github.com/0xaje/AiraMarKet)
  - 📜 **GIWA Explorer Contract:** [`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`](https://sepolia-explorer.giwa.io/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846)

---

## 📌 Instructions to Convert to Shareable Google Slides / PDF Link
1. Open [Google Slides](https://slides.google.com) or [Canva](https://canva.com).
2. Create a new presentation and copy/paste each slide's Header, Visual Cue, and Bullet Points above into 10 slides.
3. Click **Share** (top right) in Google Slides ➔ Change permission to **"Anyone with the link can view"**.
4. Copy the shareable link and paste it into your hackathon/grant submission form!
