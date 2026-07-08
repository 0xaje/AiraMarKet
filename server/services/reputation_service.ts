import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Logger } from '../utils/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AgentReputationStats {
    agentName: string;
    successfulProposals: number;
    failedProposals: number;
    totalEvaluations: number;
    averageConfidence: number;
    agreementRate: number;
    falsePositives: number;
    falseNegatives: number;
    reputationScore: number;
    currentWeight: number;
}

const BASE_WEIGHTS: Record<string, number> = {
    AnalystAgent: 1.2,
    RiskAgent: 1.5,
    ComplianceAgent: 1.0
};

export class ReputationService {
    private static instance: ReputationService;
    private logFile = path.join(__dirname, '../../logs/agent_reputation.json');

    private constructor() {
        this.initializeFile();
    }

    public static getInstance(): ReputationService {
        if (!this.instance) {
            this.instance = new ReputationService();
        }
        return this.instance;
    }

    private initializeFile() {
        const logDir = path.dirname(this.logFile);
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }
        if (!fs.existsSync(this.logFile)) {
            const initialData: Record<string, AgentReputationStats> = {
                AnalystAgent: this.createDefaultStats('AnalystAgent'),
                RiskAgent: this.createDefaultStats('RiskAgent'),
                ComplianceAgent: this.createDefaultStats('ComplianceAgent')
            };
            fs.writeFileSync(this.logFile, JSON.stringify(initialData, null, 2), 'utf-8');
        }
    }

    private createDefaultStats(agentName: string): AgentReputationStats {
        return {
            agentName,
            successfulProposals: 0,
            failedProposals: 0,
            totalEvaluations: 0,
            averageConfidence: 0.5,
            agreementRate: 1.0,
            falsePositives: 0,
            falseNegatives: 0,
            reputationScore: 100, // Starts at 100
            currentWeight: BASE_WEIGHTS[agentName] || 1.0
        };
    }

    private loadData(): Record<string, AgentReputationStats> {
        this.initializeFile();
        try {
            const content = fs.readFileSync(this.logFile, 'utf-8');
            return JSON.parse(content);
        } catch (e) {
            Logger.warn('[REPUTATION_SERVICE] Local cache missing or corrupt, re-initializing empty...');
            return {};
        }
    }

    private saveData(data: Record<string, AgentReputationStats>) {
        try {
            fs.writeFileSync(this.logFile, JSON.stringify(data, null, 2), 'utf-8');
        } catch (e) {
            Logger.error('[REPUTATION_SERVICE] Error saving reputation file', e);
        }
    }

    public async getAllReputations(): Promise<AgentReputationStats[]> {
        return Object.values(this.loadData());
    }

    public async getReputation(agentName: string): Promise<AgentReputationStats> {
        const data = this.loadData();
        if (!data[agentName]) {
            data[agentName] = this.createDefaultStats(agentName);
            this.saveData(data);
        }
        return data[agentName];
    }

    /**
     * Returns dynamic reputation adjustments to replace static agent config.
     */
    public getReputationParams(agentName: string) {
        const data = this.loadData();
        const stats = data[agentName] || this.createDefaultStats(agentName);
        
        // Base config references
        const baseWeight = BASE_WEIGHTS[agentName] || 1.0;
        const baseAccuracy = agentName === 'AnalystAgent' ? 0.92 : agentName === 'RiskAgent' ? 0.88 : 0.95;
        const baseConfidenceAdj = agentName === 'AnalystAgent' ? 1.0 : agentName === 'RiskAgent' ? 0.95 : 1.05;

        // Dynamic consensus weight scaling formula
        const dynamicWeight = baseWeight * (0.5 + 0.5 * (stats.reputationScore / 100));

        return {
            weight: Number(dynamicWeight.toFixed(4)),
            historicalAccuracy: stats.totalEvaluations > 0 ? Number(stats.agreementRate.toFixed(4)) : baseAccuracy,
            reputation: Number(stats.reputationScore.toFixed(4)),
            confidenceAdjustment: baseConfidenceAdj
        };
    }

    /**
     * Updates agent reputation stats when a consensus round concludes.
     */
    public async recordConsensusRound(votes: any[], finalOutcome: 'APPROVE' | 'REJECT') {
        const data = this.loadData();

        for (const vote of votes) {
            const agentName = vote.agentName;
            if (!data[agentName]) {
                data[agentName] = this.createDefaultStats(agentName);
            }

            const stats = data[agentName];
            stats.totalEvaluations += 1;

            // Recalculate average confidence
            stats.averageConfidence = Number(((stats.averageConfidence * (stats.totalEvaluations - 1) + vote.confidence) / stats.totalEvaluations).toFixed(4));

            const isAgreement = vote.vote === finalOutcome;
            if (isAgreement) {
                stats.successfulProposals += 1;
            } else {
                stats.failedProposals += 1;
                if (vote.vote === 'APPROVE' && finalOutcome === 'REJECT') {
                    stats.falsePositives += 1;
                } else if (vote.vote === 'REJECT' && finalOutcome === 'APPROVE') {
                    stats.falseNegatives += 1;
                }
            }

            // Agreement Rate and Reputation Score Math
            stats.agreementRate = Number((stats.successfulProposals / stats.totalEvaluations).toFixed(4));
            stats.reputationScore = Number((stats.agreementRate * 100).toFixed(4));

            // Update consensus weight
            const baseWeight = BASE_WEIGHTS[agentName] || 1.0;
            stats.currentWeight = Number((baseWeight * (0.5 + 0.5 * (stats.reputationScore / 100))).toFixed(4));
        }

        this.saveData(data);
        Logger.success('[REPUTATION_SERVICE] Agent reputation matrices updated successfully.');
    }
}

export const reputationService = ReputationService.getInstance();
