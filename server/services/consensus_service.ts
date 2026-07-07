import { eventBus, SystemEvents } from '../core/event_bus';
import { Logger } from '../utils/logger';

export class ConsensusService {
    private votesCache = new Map<string, any[]>();
    private QUORUM = 3;
    private APPROVAL_THRESHOLD = 0.66; // 66% approval (2 out of 3)
    private CONFIDENCE_THRESHOLD = 0.75; // Average confidence >= 0.75

    constructor() {
        eventBus.on(SystemEvents.EVALUATION_SUBMITTED, this.handleEvaluation.bind(this));
    }

    private async handleEvaluation(vote: any) {
        const { signalId } = vote;
        Logger.info(`[CONSENSUS_SERVICE] Evaluation submitted by ${vote.agentName} for signal ${signalId}. Vote: ${vote.vote}, Confidence: ${vote.confidence}`);

        if (!this.votesCache.has(signalId)) {
            this.votesCache.set(signalId, []);
        }

        const votes = this.votesCache.get(signalId)!;
        votes.push(vote);

        if (votes.length >= this.QUORUM) {
            await this.processConsensus(signalId, votes);
            this.votesCache.delete(signalId);
        }
    }

    private async processConsensus(signalId: string, votes: any[]) {
        Logger.info(`[CONSENSUS_SERVICE] Quorum met for signal ${signalId}. Processing consensus...`);

        const approvals = votes.filter(v => v.vote === 'APPROVE');
        const approvalRatio = approvals.length / votes.length;

        if (approvalRatio >= this.APPROVAL_THRESHOLD) {
            const avgConfidence = approvals.reduce((sum, v) => sum + v.confidence, 0) / approvals.length;

            if (avgConfidence >= this.CONFIDENCE_THRESHOLD) {
                Logger.success(`[CONSENSUS_SERVICE] Consensus APPROVED for signal ${signalId} (Ratio: ${approvalRatio.toFixed(2)}, Avg Confidence: ${avgConfidence.toFixed(2)})`);

                // Aggregate metadata from the first approving vote
                const baseVote = approvals[0];
                const consolidatedProposal = {
                    signalId,
                    title: baseVote.title,
                    category: baseVote.category,
                    expiry: String(baseVote.expiry),
                    confidence: Number(avgConfidence.toFixed(4)),
                    sentiment: baseVote.sentiment || 'BULLISH',
                    status: 'PENDING_APPROVAL',
                    evaluations: votes.map(v => ({
                        agentName: v.agentName,
                        vote: v.vote,
                        confidence: v.confidence,
                        reasoning: v.reasoning
                    }))
                };

                // Emit MARKET_APPROVED event to trigger decision proposal generation lifecycle
                eventBus.emit(SystemEvents.MARKET_APPROVED, consolidatedProposal);
            } else {
                Logger.warn(`[CONSENSUS_SERVICE] Consensus REJECTED for signal ${signalId}: Average confidence ${avgConfidence.toFixed(2)} is below threshold ${this.CONFIDENCE_THRESHOLD}`);
            }
        } else {
            Logger.warn(`[CONSENSUS_SERVICE] Consensus REJECTED for signal ${signalId}: Approval ratio ${approvalRatio.toFixed(2)} is below threshold ${this.APPROVAL_THRESHOLD}`);
        }
    }
}

export const consensusService = new ConsensusService();

