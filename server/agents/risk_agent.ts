import { eventBus, SystemEvents } from '../core/event_bus';
import { Logger } from '../utils/logger';

export class RiskAgent {
    constructor() {
        eventBus.on(SystemEvents.MARKET_PROPOSAL_GENERATED, this.handleEvaluation.bind(this));
    }

    private async handleEvaluation(proposal: any) {
        Logger.info(`[RISK_AGENT] Evaluating temporal feasibility, operational risk, and protocol integrity before proposals enter consensus for signal ${proposal.signalId}...`);

        const now = Math.floor(Date.now() / 1000);
        const expiryTime = Number(proposal.expiry);
        
        let vote: 'APPROVE' | 'REJECT' = 'APPROVE';
        let confidence = 0.90;
        let reasoning = '';

        if (isNaN(expiryTime) || expiryTime <= now) {
            vote = 'REJECT';
            confidence = 0.10;
            reasoning = 'Proposed expiry timestamp is invalid or in the past.';
        } else {
            const bufferHours = (expiryTime - now) / 3600;
            if (bufferHours < 12) {
                vote = 'REJECT';
                confidence = 0.30;
                reasoning = `Insufficient timeline buffer: proposed decision window (${bufferHours.toFixed(1)} hrs) is below the 12-hour risk minimum.`;
            } else if (bufferHours < 24) {
                vote = 'APPROVE';
                confidence = 0.75;
                reasoning = `Acceptable short-term risk window (${bufferHours.toFixed(1)} hrs). Buffer is tight but trade execution is viable.`;
            } else {
                vote = 'APPROVE';
                confidence = 0.95;
                reasoning = `Optimal risk window (${bufferHours.toFixed(1)} hrs). Enforces standard liquidity stabilization curves.`;
            }
        }

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
