export interface AgentConsensusParams {
    weight: number;              // Raw voting weight multiplier
    historicalAccuracy: number;  // Historical accuracy rating percentage (e.g. 0.92)
    reputation: number;          // Reputation rating index (e.g. 95)
    confidenceAdjustment: number;// Scaling factor applied to raw agent confidence scores
}

export const AGENT_REGISTRY: Record<string, AgentConsensusParams> = {
    AnalystAgent: {
        weight: 1.2,
        historicalAccuracy: 0.92,
        reputation: 95,
        confidenceAdjustment: 1.00
    },
    RiskAgent: {
        weight: 1.5,
        historicalAccuracy: 0.88,
        reputation: 90,
        confidenceAdjustment: 0.95
    },
    ComplianceAgent: {
        weight: 1.0,
        historicalAccuracy: 0.95,
        reputation: 98,
        confidenceAdjustment: 1.05
    }
};
