import { eventBus, SystemEvents } from '../core/event_bus';
import { AIService } from '../services/ai_service';
import { NormalizedSignal } from '../services/signal_ingestion';
import { Logger } from '../utils/logger';

export class AnalystAgent {
    constructor() {
        // Step 1: Listen for incoming signals and generate structured proposals
        eventBus.on(SystemEvents.SIGNAL_RECEIVED, this.handleSignal.bind(this));

        // Step 2: Listen for generated proposals and submit sentiment evaluation
        eventBus.on(SystemEvents.MARKET_PROPOSAL_GENERATED, this.handleProposalEvaluation.bind(this));
    }

    private async handleSignal(signal: NormalizedSignal) {
        const signalId = signal.topic.replace(/[^a-zA-Z0-9]/g, '').substring(0, 24) || 'default-signal';
        Logger.info(`[ANALYST_AGENT] Ingesting signal ${signalId} for proposal generation...`);
        try {
            const proposal = await AIService.generateMarketProposal(signal);
            
            // Broadcast the generated proposal for collaborative swarm review
            eventBus.emit(SystemEvents.MARKET_PROPOSAL_GENERATED, {
                signalId,
                title: proposal.title,
                category: signal.category || proposal.category || 'misc',
                expiry: proposal.expiry,
                sentiment: signal.sentiment.toUpperCase(),
                rawConfidence: proposal.confidence
            });
        } catch (error) {
            Logger.error(`[ANALYST_AGENT] Error generating proposal for signal ${signalId}`, error);
        }
    }

    private async handleProposalEvaluation(proposal: any) {
        Logger.info(`[ANALYST_AGENT] Evaluating proposal sentiment for signal ${proposal.signalId}...`);
        
        const isApproved = proposal.rawConfidence > 0.70;
        const vote = isApproved ? 'APPROVE' : 'REJECT';
        const reasoning = isApproved
            ? `LLM analyst confirmed strong sentiment alignment (Confidence: ${proposal.rawConfidence.toFixed(2)})`
            : `LLM analyst rejected proposal: confidence score ${proposal.rawConfidence.toFixed(2)} is below threshold (0.70)`;

        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId: proposal.signalId,
            agentName: 'AnalystAgent',
            title: proposal.title,
            category: proposal.category,
            expiry: proposal.expiry,
            sentiment: proposal.sentiment,
            vote,
            confidence: proposal.rawConfidence,
            reasoning
        });
    }
}

export const analystAgent = new AnalystAgent();

