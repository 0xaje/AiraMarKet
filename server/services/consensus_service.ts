import { eventBus, SystemEvents } from '../core/event_bus';
import { Logger } from '../utils/logger';
import { EvidenceService } from './evidence/service';
import { reputationService } from './reputation_service';
import { TransparencyLogger } from './transparency_logger';

export class ConsensusService {
    private votesCache = new Map<string, any[]>();
    private QUORUM = 3;
    private APPROVAL_THRESHOLD = 0.66; // 66% weighted score
    private CONFIDENCE_THRESHOLD = 0.75; // 0.75 weighted confidence

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

        let totalWeight = 0;
        let weightedApprovalSum = 0;
        let weightedConfidenceSum = 0;
        let totalReputationWeight = 0;
        let weightedReputationSum = 0;

        const auditTrail: any[] = [];

        for (const vote of votes) {
            // Fetch dynamically updated metrics from the Reputation System
            const params = reputationService.getReputationParams(vote.agentName);

            const adjustedConfidence = Math.min(1.0, vote.confidence * params.confidenceAdjustment);
            const isApproved = vote.vote === 'APPROVE';
            
            // Core contributions math
            const contributionWeight = params.weight * params.historicalAccuracy;
            totalWeight += contributionWeight;
            
            if (isApproved) {
                weightedApprovalSum += contributionWeight;
            }
            
            weightedConfidenceSum += adjustedConfidence * params.weight;
            totalReputationWeight += params.weight;
            weightedReputationSum += params.reputation * params.weight;

            auditTrail.push({
                agentName: vote.agentName,
                vote: vote.vote,
                rawConfidence: vote.confidence,
                adjustedConfidence,
                weight: params.weight,
                accuracy: params.historicalAccuracy,
                reputation: params.reputation,
                contributionWeight
            });
        }

        // Consolidated metrics
        const weightedScore = totalWeight > 0 ? (weightedApprovalSum / totalWeight) : 0;
        const weightedConfidence = totalReputationWeight > 0 ? (weightedConfidenceSum / totalReputationWeight) : 0;
        const avgReputation = totalReputationWeight > 0 ? (weightedReputationSum / totalReputationWeight) : 80;
        
        // Compound Approval Probability formula
        const approvalProbability = weightedScore * (0.5 + 0.5 * weightedConfidence) * (avgReputation / 100);

        // Determine final epoch round outcome
        const isApprovedOutcome = weightedScore >= this.APPROVAL_THRESHOLD && weightedConfidence >= this.CONFIDENCE_THRESHOLD;
        const finalOutcome = isApprovedOutcome ? 'APPROVE' : 'REJECT';

        // Update Reputation logs based on consensus matching
        await reputationService.recordConsensusRound(votes, finalOutcome);

        // Record metrics to telemetry log
        TransparencyLogger.logConsensusAudit({
            signalId,
            weightedScore,
            weightedConfidence,
            approvalProbability,
            auditTrail,
            timestamp: new Date().toISOString()
        });

        if (isApprovedOutcome) {
            Logger.success(`[CONSENSUS_SERVICE] Weighted consensus APPROVED for signal ${signalId} (Score: ${weightedScore.toFixed(2)}, Confidence: ${weightedConfidence.toFixed(2)}, Probability: ${(approvalProbability * 100).toFixed(1)}%)`);

            // Aggregate metadata from the first approving vote
            const approvals = votes.filter(v => v.vote === 'APPROVE');
            const baseVote = approvals[0] || votes[0];

            const consensusReasoning = `Weighted consensus APPROVED (Weighted Score: ${weightedScore.toFixed(4)}, Weighted Confidence: ${weightedConfidence.toFixed(4)}, Probability: ${(approvalProbability * 100).toFixed(1)}%). Node votes: ` + 
                votes.map(v => `${v.agentName}: ${v.vote} (Conf: ${v.confidence.toFixed(2)})`).join(', ');

            // Compile the final verifiable, immutable Evidence Package
            const evidence = await EvidenceService.generatePackage(
                {
                    category: baseVote.category,
                    topic: baseVote.title,
                    source: 'Multi-Agent Audits',
                    signal_strength: Math.floor(weightedConfidence * 100),
                    sentiment: baseVote.sentiment
                },
                votes,
                consensusReasoning,
                weightedConfidence,
                {
                    protocolVersion: 'v2.4.0',
                    provider: 'Local IPFS Node'
                }
            );

            const consolidatedProposal = {
                signalId,
                title: baseVote.title,
                category: baseVote.category,
                expiry: String(baseVote.expiry),
                confidence: Number(weightedConfidence.toFixed(4)),
                sentiment: baseVote.sentiment || 'BULLISH',
                status: 'PENDING_APPROVAL',
                ipfsHash: evidence.hash,
                evidencePackage: evidence.payload,
                evaluations: votes.map(v => ({
                    agentName: v.agentName,
                    vote: v.vote,
                    confidence: v.confidence,
                    reasoning: v.reasoning
                })),
                intelligenceReport: baseVote.intelligenceReport
            };

            // Emit event
            eventBus.emit(SystemEvents.MARKET_APPROVED, consolidatedProposal);
        } else {
            if (weightedScore < this.APPROVAL_THRESHOLD) {
                Logger.warn(`[CONSENSUS_SERVICE] Weighted consensus REJECTED for signal ${signalId}: Weighted score ${weightedScore.toFixed(2)} is below threshold ${this.APPROVAL_THRESHOLD}`);
            } else {
                Logger.warn(`[CONSENSUS_SERVICE] Weighted consensus REJECTED for signal ${signalId}: Weighted confidence ${weightedConfidence.toFixed(2)} is below threshold ${this.CONFIDENCE_THRESHOLD}`);
            }
        }
    }
}

export const consensusService = new ConsensusService();
