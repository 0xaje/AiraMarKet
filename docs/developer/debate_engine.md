# Multi-Agent Debate Engine Architecture
### Transitioning from Independent Agent Voting to Interactive Consensus Challenges

---

## 1. Executive Summary

Traditional multi-agent systems process evaluations independently, which can lead to echo-chamber confirmation biases or unaddressed contradictions. The **Agent Debate Engine** resolves this by establishing an interactive, sequential debate loop where agents challenge each other's assertions before reaching consensus.

### The Debate Lifecycle Flow
```
[Analyst Agent]
   │  Proposes Signal
   ▼
[Risk Agent]
   │  Audits proposal & raises questions
   ▼
[Compliance Agent]
   │  Audits proposal + Risk review, raises compliance questions
   ▼
[Analyst Agent]
   │  Responds to questions & locks final position
   ▼
[Consensus Service]
      Determines verdict based on final positions
```

---

## 2. Event Specification

To drive the state transitions of the debate loop, the central event bus [event_bus.ts](file:///home/oyeolorun/AiraMarKet/server/core/event_bus.ts) declares five new event enums:

| Event Name | Emitter | Description |
| :--- | :--- | :--- |
| `DEBATE_INITIATED` | `AnalystAgent` | Analyst processes a signal, starts a debate session, and records the initial proposal. |
| `DEBATE_RISK_REVIEWED` | `RiskAgent` | Risk evaluates the analyst proposal, posting arguments, counter-arguments, and risk questions. |
| `DEBATE_COMPLIANCE_REVIEWED` | `ComplianceAgent` | Compliance evaluates the analyst proposal and risk audits, posting compliance questions. |
| `DEBATE_ANALYST_RESPONDED` | `AnalystAgent` | Analyst addresses questions raised by other agents and locks its final decision position. |
| `DEBATE_CONCLUDED` | `ConsensusService` | Consensus calculates weights, resolves the debate outcome, and triggers L2 contract creation if approved. |

---

## 3. Database Persistent Models

The debate session history is saved off-chain. The relational models are declared in [schema.prisma](file:///home/oyeolorun/AiraMarKet/prisma/schema.prisma):

```prisma
model DebateSession {
  id              Int          @id @default(autoincrement())
  signalId        String       @unique
  pendingMarketId Int?         @unique
  pendingMarket   PendingMarket? @relation(fields: [pendingMarketId], references: [id], onDelete: Cascade)
  status          String       // "INITIATED", "RISK_REVIEW", "COMPLIANCE_REVIEW", "ANALYST_RESPONSE", "CONCLUDED"
  turns           DebateTurn[]
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
}

model DebateTurn {
  id               Int           @id @default(autoincrement())
  sessionId        Int
  session          DebateSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  agentName        String        // "AnalystAgent", "RiskAgent", "ComplianceAgent"
  role             String        // "PROPOSER", "REVIEWER", "RESPONDER"
  arguments        String        // JSON string represented as string (string[])
  counterArguments String        // JSON string represented as string (string[])
  questions        String        // JSON string represented as string (string[])
  responses        String        // JSON string represented as string (string[])
  vote             String?       // "APPROVE", "REJECT" (for final position)
  confidence       Float?
  createdAt        DateTime      @default(now())
}
```

---

## 4. Debate Engine Execution Specification

The state transitions are governed by a state machine matching the session status field:

```
        ┌─────────────┐
        │  INITIATED  │ ◄─── Analyst Proposes
        └──────┬──────┘
               │ Emit: DEBATE_INITIATED
               ▼
        ┌─────────────┐
        │ RISK_REVIEW │ ◄─── Risk reviews & raises questions
        └──────┬──────┘
               │ Emit: DEBATE_RISK_REVIEWED
               ▼
      ┌───────────────────┐
      │ COMPLIANCE_REVIEW │ ◄─── Compliance reviews both
      └────────┬──────────┘
               │ Emit: DEBATE_COMPLIANCE_REVIEWED
               ▼
      ┌──────────────────┐
      │ ANALYST_RESPONSE │ ◄─── Analyst answers & locks position
      └────────┬─────────┘
               │ Emit: DEBATE_ANALYST_RESPONDED
               ▼
        ┌─────────────┐
        │  CONCLUDED  │ ◄─── Consensus aggregates final votes
        └─────────────┘
```

### Turn Content Schema
The structure of each turn is validated against the formal JSON Schema in [schema.json](file:///home/oyeolorun/AiraMarKet/server/services/debate/schema.json). Each turn exposes:
- **Arguments**: Supporting claims matching the agent's specific domain (e.g., Risk points out positive temporal buffer).
- **Counter-arguments**: Critical concerns or challenges matching preceding turns.
- **Questions**: Structural concerns requiring explanation from other agents.
- **Responses**: Answers to questions directed to this agent in prior turns.
- **Final Positions (Only logged during responds)**: Recommended final decision (`APPROVE`/`REJECT`) and confidence score.
