import { eventBus, SystemEvents } from '../core/event_bus';
import { AIService } from '../services/ai_service';
import { llmManager } from '../services/llm/manager';
import { NormalizedSignal } from '../services/signal_ingestion';
import { Logger } from '../utils/logger';

export class AnalystAgent {
    constructor() {
        // Step 1: Perform semantic reasoning over normalized signals and generate structured intelligence with confidence scoring
        eventBus.on(SystemEvents.SIGNAL_RECEIVED, this.handleSignal.bind(this));

        // Step 2: Formulate sentiment assessments and compile structured evaluations
        eventBus.on(SystemEvents.MARKET_PROPOSAL_GENERATED, this.handleProposalEvaluation.bind(this));
    }

    private async handleSignal(signal: NormalizedSignal) {
        const signalId = signal.topic.replace(/[^a-zA-Z0-9]/g, '').substring(0, 24) || 'default-signal';
        Logger.info(`[ANALYST_AGENT] Ingesting signal ${signalId} for proposal generation...`);
        try {
            const proposal = await AIService.generateMarketProposal(signal);
            
            // Broadcast the generated proposal for collaborative consensus review
            eventBus.emit(SystemEvents.MARKET_PROPOSAL_GENERATED, {
                signalId,
                title: proposal.title,
                category: signal.category || proposal.category || 'misc',
                expiry: proposal.expiry,
                sentiment: signal.sentiment.toUpperCase(),
                rawConfidence: proposal.confidence,
                intelligenceReport: proposal.intelligenceReport
            });
        } catch (error) {
            Logger.error(`[ANALYST_AGENT] Error generating proposal for signal ${signalId}`, error);
        }
    }

    private async handleProposalEvaluation(proposal: any) {
        Logger.info(`[ANALYST_AGENT] Submitting proposal sentiment to LLM for signal ${proposal.signalId}...`);
        
        try {
            const prompt = `
Task: Perform a semantic sentiment audit on the following decision proposal.
Proposal Title: "${proposal.title}"
Proposal Category: "${proposal.category}"
Proposal Expiry: "${proposal.expiry}"
Input Sentiment: "${proposal.sentiment}"
Input Confidence: ${proposal.rawConfidence}

Evaluate whether this proposal exhibits sustainable, positive sentiment indicators and clear event boundary logic.
You MUST respond in strict JSON matching this schema:
{
  "decision": "APPROVE" | "REJECT",
  "confidence": <number between 0.0 and 1.0>,
  "reasoning": "<concise reasoning details>",
  "risks": "<key risk factors>",
  "supportingEvidence": "<evidence references>",
  "recommendedQuestion": "<optional representation question>"
}
Do not include markdown blocks. Raw JSON only.
`;

            const evaluation = await llmManager.analyze(prompt);

            eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
                signalId: proposal.signalId,
                agentName: 'AnalystAgent',
                title: proposal.title,
                category: proposal.category,
                expiry: proposal.expiry,
                sentiment: proposal.sentiment,
                vote: evaluation.decision,
                confidence: evaluation.confidence,
                reasoning: evaluation.reasoning,
                intelligenceReport: proposal.intelligenceReport
            });
        } catch (error) {
            Logger.error(`[ANALYST_AGENT] Error running LLM evaluation for signal ${proposal.signalId}`, error);
            
            // Fallback safety rule
            eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
                signalId: proposal.signalId,
                agentName: 'AnalystAgent',
                title: proposal.title,
                category: proposal.category,
                expiry: proposal.expiry,
                sentiment: proposal.sentiment,
                vote: 'REJECT',
                confidence: 0.10,
                reasoning: `LLM evaluation pipeline failed: ${error}`,
                intelligenceReport: proposal.intelligenceReport
            });
        }
    }
}

export const analystAgent = new AnalystAgent();
