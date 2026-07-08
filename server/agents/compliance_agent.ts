import { eventBus, SystemEvents } from '../core/event_bus';
import { llmManager } from '../services/llm/manager';
import { Logger } from '../utils/logger';

export class ComplianceAgent {
    // Basic safety checks as an absolute backup/enforcer
    private static BANNED_TERMS = ['death', 'assassination', 'kill', 'illegal', 'hack', 'exploit', 'violence', 'murder'];
    private static ALLOWED_CATEGORIES = ['crypto', 'tech', 'sports', 'politics', 'misc'];

    constructor() {
        eventBus.on(SystemEvents.MARKET_PROPOSAL_GENERATED, this.handleEvaluation.bind(this));
    }

    private async handleEvaluation(proposal: any) {
        Logger.info(`[COMPLIANCE_AGENT] Submitting compliance checks to LLM for signal ${proposal.signalId}...`);

        const titleLower = (proposal.title || '').toLowerCase();
        const categoryLower = (proposal.category || '').toLowerCase();

        // Protocol Safety Rule Enforcer (hard gatekeep backup check)
        const matchedTerm = ComplianceAgent.BANNED_TERMS.find(term => titleLower.includes(term));
        if (matchedTerm) {
            Logger.warn(`[COMPLIANCE_AGENT] Protocol safety rule triggered: title contains restricted term "${matchedTerm}"`);
            this.emitResponse(proposal, 'REJECT', 0.05, `Content safety policy violation: title contains restricted term "${matchedTerm}".`);
            return;
        }

        if (!ComplianceAgent.ALLOWED_CATEGORIES.includes(categoryLower)) {
            Logger.warn(`[COMPLIANCE_AGENT] Protocol safety rule triggered: unsupported category "${proposal.category}"`);
            this.emitResponse(proposal, 'REJECT', 0.20, `Unsupported decision category: "${proposal.category}".`);
            return;
        }

        try {
            const prompt = `
Task: Perform a regulatory compliance and category alignment check on the following proposed decision proposal.
Proposal Title: "${proposal.title}"
Proposal Category: "${proposal.category}"

Evaluate if the proposal complies with content safety guidelines (no hate speech, violence, illegal activities, or death) and fits within standard public interest domains.
You MUST respond in strict JSON matching this schema:
{
  "decision": "APPROVE" | "REJECT",
  "confidence": <number between 0.0 and 1.0>,
  "reasoning": "<concise reasoning details>",
  "risks": "<key compliance risks>",
  "supportingEvidence": "<banned or restricted term matches, domain list validations>",
  "recommendedQuestion": "<optional representation question>"
}
Do not include markdown blocks. Raw JSON only.
`;

            const evaluation = await llmManager.analyze(prompt);
            this.emitResponse(proposal, evaluation.decision, evaluation.confidence, evaluation.reasoning);

        } catch (error) {
            Logger.error(`[COMPLIANCE_AGENT] Error running LLM compliance checks for signal ${proposal.signalId}`, error);
            // Fallback safety rule
            this.emitResponse(proposal, 'REJECT', 0.15, `LLM compliance pipeline failed: ${error}`);
        }
    }

    private emitResponse(proposal: any, vote: 'APPROVE' | 'REJECT', confidence: number, reasoning: string) {
        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId: proposal.signalId,
            agentName: 'ComplianceAgent',
            title: proposal.title,
            category: proposal.category,
            expiry: proposal.expiry,
            sentiment: proposal.sentiment,
            vote,
            confidence,
            reasoning
        });
    }
}

export const complianceAgent = new ComplianceAgent();
