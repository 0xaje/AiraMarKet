import { eventBus, SystemEvents } from '../core/event_bus';
import { Logger } from '../utils/logger';

export class ComplianceAgent {
    private static BANNED_TERMS = ['death', 'assassination', 'kill', 'illegal', 'hack', 'exploit', 'violence', 'murder'];
    private static ALLOWED_CATEGORIES = ['crypto', 'tech', 'sports', 'politics', 'misc'];

    constructor() {
        eventBus.on(SystemEvents.MARKET_PROPOSAL_GENERATED, this.handleEvaluation.bind(this));
    }

    private async handleEvaluation(proposal: any) {
        Logger.info(`[COMPLIANCE_AGENT] Evaluating policy compliance, supported domains, and protocol safety requirements for signal ${proposal.signalId}...`);

        const titleLower = (proposal.title || '').toLowerCase();
        const categoryLower = (proposal.category || '').toLowerCase();
        
        let vote: 'APPROVE' | 'REJECT' = 'APPROVE';
        let confidence = 0.95;
        let reasoning = 'Proposal complies with all standard content policies and supported category structures.';

        // 1. Check for banned terms
        const matchedTerm = ComplianceAgent.BANNED_TERMS.find(term => titleLower.includes(term));
        if (matchedTerm) {
            vote = 'REJECT';
            confidence = 0.05;
            reasoning = `Content safety policy violation: proposed title contains restricted term "${matchedTerm}".`;
        }

        // 2. Check for allowed categories
        if (vote === 'APPROVE' && !ComplianceAgent.ALLOWED_CATEGORIES.includes(categoryLower)) {
            vote = 'REJECT';
            confidence = 0.20;
            reasoning = `Unsupported decision category: "${proposal.category}". Approved categories are: ${ComplianceAgent.ALLOWED_CATEGORIES.join(', ')}.`;
        }

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
