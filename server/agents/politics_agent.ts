import { eventBus, SystemEvents } from '../core/event_bus';
import { AIService } from '../services/ai_service';
import { NormalizedSignal } from '../services/signal_ingestion';
import { Logger } from '../utils/logger';

/**
 * Autonomous Agent for Politics Markets
 */
export class PoliticsAgent {
    constructor() {
        eventBus.on(SystemEvents.SIGNAL_RECEIVED, async (signal: NormalizedSignal) => {
            if (signal.category === 'politics') {
                Logger.info(`[POLITICS_AGENT] Fetching & processing politics signal...`);
                
                // Send signal to LLM for interpretation
                const proposal = await AIService.generateMarketProposal(signal);
                
                // Validate confidence threshold (> 0.7)
                if (proposal.confidence > 0.7) {
                    eventBus.emit(SystemEvents.MARKET_APPROVED, proposal);
                } else {
                    Logger.warn(`[POLITICS_AGENT] Proposal rejected. Confidence ${proposal.confidence} <= 0.7`);
                }
            }
        });
    }
}

export const politicsAgent = new PoliticsAgent();
