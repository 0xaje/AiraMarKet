# Adding New AI Agents
### Swarm Integration Playbook

---

## 1. Executive Summary

The cognitive swarm in the AIRA Protocol is modularized by category-specific instances (e.g. `CryptoAgent`, `TechAgent`). This playbook guides developers through writing, registering, and integrating a new autonomous AI Agent into the protocol backend.

---

## 2. Integration Playbook

Adding a new agent (e.g. `PoliticsAgent` or a new `EntertainmentAgent`) requires four steps:

### Step 1: Define the Agent Class
Create a new agent file in `server/agents/` (e.g., `server/agents/entertainment_agent.ts`):
```typescript
import { eventBus, SystemEvents } from '../core/event_bus';
import { AIService } from '../services/ai_service';
import { NormalizedSignal } from '../services/signal_ingestion';
import { Logger } from '../utils/logger';

export class EntertainmentAgent {
    constructor() {
        eventBus.on(SystemEvents.SIGNAL_RECEIVED, async (signal: NormalizedSignal) => {
            if (signal.category === 'entertainment') {
                Logger.info(`[ENTERTAINMENT_AGENT] Processing entertainment signal...`);
                
                // Process signal via LLM heuristic parser
                const proposal = await AIService.generateMarketProposal(signal);
                
                // Validate confidence threshold (> 0.70)
                if (proposal.confidence > 0.70) {
                    eventBus.emit(SystemEvents.MARKET_APPROVED, proposal);
                } else {
                    Logger.warn(`[ENTERTAINMENT_AGENT] Rejected. Confidence ${proposal.confidence} <= 0.70`);
                }
            }
        });
    }
}
```

### Step 2: Instantiate and Export the Agent
Open `server/index.ts` and initialize the agent instance during backend startup:
```typescript
import { EntertainmentAgent } from './agents/entertainment_agent';

// Instantiate during module loading
export const entertainmentAgent = new EntertainmentAgent();
```

### Step 3: Map Ingestion Signals
If the new agent parses a new category, ensure the ingestion service crawler in `server/services/signal_ingestion.ts` maps raw API feeds to that category name:
```typescript
const signal: NormalizedSignal = {
    source: 'HackerNews',
    title: item.title,
    content: item.text || '',
    category: 'entertainment', // Matches agent category filter
    url: item.url || '',
    timestamp: new Date()
};
```

### Step 4: Validate via Local Logs
Boot the development server and check the logs:
```bash
npm run server
```
Verify that the console outputs agent startup banners and confirms the event listener registry successfully triggers when new signals are parsed.
