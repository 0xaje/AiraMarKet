import { eventBus, SystemEvents } from '../core/event_bus';
import { AIService } from '../services/ai_service';
import { NormalizedSignal } from '../services/signal_ingestion';
import { Logger } from '../utils/logger';

/**
 * Autonomous Agent for Crypto Markets
 */
export class CryptoAgent {
    constructor() {
        eventBus.on(SystemEvents.SIGNAL_RECEIVED, async (signal: NormalizedSignal) => {
            if (signal.category === 'crypto') {
                Logger.info(`[CRYPTO_AGENT] Fetching & processing crypto signal...`);
                
                // Send signal to LLM for interpretation
                const proposal = await AIService.generateMarketProposal(signal);
                
                // Validate confidence threshold (> 0.7)
                if (proposal.confidence > 0.7) {
                    eventBus.emit(SystemEvents.MARKET_APPROVED, proposal);
                } else {
                    Logger.warn(`[CRYPTO_AGENT] Proposal rejected. Confidence ${proposal.confidence} <= 0.7`);
                }
            }
        });
    }
}

export const cryptoAgent = new CryptoAgent();
