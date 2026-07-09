export type AgentRole = 'PROPOSER' | 'REVIEWER' | 'RESPONDER';

export type DebateStatus = 'INITIATED' | 'RISK_REVIEW' | 'COMPLIANCE_REVIEW' | 'ANALYST_RESPONSE' | 'CONCLUDED';

export interface DebateTurn {
    id?: number;
    sessionId?: number;
    agentName: string;         // 'AnalystAgent' | 'RiskAgent' | 'ComplianceAgent'
    role: AgentRole;
    arguments: string[];       // Primary arguments/claims supporting position
    counterArguments: string[]; // Counter-arguments addressing other agents' claims
    questions: string[];       // Questions raised for other agents to address
    responses: string[];       // Answers/responses to questions raised
    vote?: 'APPROVE' | 'REJECT'; // Agent's recommended verdict (optional until response phase)
    confidence?: number;       // Confidence score (optional until response phase)
    createdAt?: string;
}

export interface DebateSession {
    id?: number;
    signalId: string;
    pendingMarketId?: number;
    status: DebateStatus;
    turns: DebateTurn[];
    createdAt?: string;
    updatedAt?: string;
}
