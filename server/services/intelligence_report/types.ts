export interface IntelligenceReport {
    id?: number;
    pendingMarketId?: number;
    signalId: string;
    summary: string;
    supportingEvidence: string[];      // Supporting evidence points
    contradictingEvidence: string[];   // Contradicting/dissenting evidence points
    confidence: number;                // Probability or confidence score (0.0 to 1.0)
    riskFactors: string[];             // Key risk factors identified
    reasoning: string;                 // Detailed logical reasoning breakdown
    recommendedDecision: string;       // Final recommendation (e.g., 'APPROVE', 'REJECT')
    createdAt?: string;
}
