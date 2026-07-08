import { eventBus, SystemEvents } from '../core/event_bus';
import { llmManager } from '../services/llm/manager';
import { Logger } from '../utils/logger';

export class RiskAgent {
    constructor() {
        eventBus.on(SystemEvents.MARKET_PROPOSAL_GENERATED, this.handleEvaluation.bind(this));
    }

    private async handleEvaluation(proposal: any) {
        Logger.info(`[RISK_AGENT] Submitting temporal feasibility and protocol risk audits to LLM for signal ${proposal.signalId}...`);

        const now = Math.floor(Date.now() / 1000);
        let expiryTime = Number(proposal.expiry);
        if (isNaN(expiryTime)) {
            expiryTime = Math.floor(new Date(proposal.expiry).getTime() / 1000);
        }

        // Protocol Safety Rule Enforcer (hard gatekeep backup check)
        if (isNaN(expiryTime) || expiryTime <= now) {
            Logger.warn(`[RISK_AGENT] Protocol safety rule triggered: invalid or past expiry timestamp`);
            this.emitResponse(proposal, 'REJECT', 0.10, 'Proposed expiry timestamp is invalid or in the past.');
            return;
        }

        const bufferHours = (expiryTime - now) / 3600;
        if (bufferHours < 12) {
            Logger.warn(`[RISK_AGENT] Protocol safety rule triggered: temporal buffer ${bufferHours.toFixed(1)} hrs is below the 12-hour minimum`);
            this.emitResponse(proposal, 'REJECT', 0.30, `Insufficient timeline buffer: proposed decision window (${bufferHours.toFixed(1)} hrs) is below the 12-hour risk minimum.`);
            return;
        }

        try {
            const prompt = `
Task: Perform a temporal feasibility and protocol risk audit on the following proposed decision proposal.
Proposal Title: "${proposal.title}"
Proposal Category: "${proposal.category}"
Proposal Expiry (Epoch Seconds): ${proposal.expiry}
Current Epoch Seconds: ${now}

Evaluate whether the proposed timeline leaves sufficient window (at least 12 hours) for settlement, disputes, and stable trading curves without presenting liquidation risks.
You MUST respond in strict JSON matching this schema:
{
  "decision": "APPROVE" | "REJECT",
  "confidence": <number between 0.0 and 1.0>,
  "reasoning": "<concise reasoning details>",
  "risks": "<key risk vectors>",
  "supportingEvidence": "<calculated temporal safety margins>",
  "recommendedQuestion": "<optional representation question>"
}
Do not include markdown blocks. Raw JSON only.
`;

            const evaluation = await llmManager.analyze(prompt);
            this.emitResponse(proposal, evaluation.decision, evaluation.confidence, evaluation.reasoning);

        } catch (error) {
            Logger.error(`[RISK_AGENT] Error running LLM risk checks for signal ${proposal.signalId}`, error);
            // Fallback safety rule
            this.emitResponse(proposal, 'REJECT', 0.15, `LLM risk evaluation pipeline failed: ${error}`);
        }
    }

    private emitResponse(proposal: any, vote: 'APPROVE' | 'REJECT', confidence: number, reasoning: string) {
        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId: proposal.signalId,
            agentName: 'RiskAgent',
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

export const riskAgent = new RiskAgent();
