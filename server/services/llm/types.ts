export interface LlmEvaluationResponse {
    decision: 'APPROVE' | 'REJECT';
    confidence: number;
    reasoning: string;
    risks: string;
    supportingEvidence: string;
    recommendedQuestion?: string;
    summary?: string;
    supportingEvidenceList?: string[];
    contradictingEvidenceList?: string[];
    riskFactorsList?: string[];
}

export interface LlmCallMetrics {
    provider: string;
    model: string;
    latencyMs: number;
    tokensUsed?: number;
    error?: string;
    timestamp: string;
}

export interface LlmProvider {
    name: string;
    model: string;
    isActive(): boolean;
    analyze(prompt: string): Promise<LlmEvaluationResponse>;
}
