import { PrismaClient } from '@prisma/client';
import { Logger } from '../utils/logger';

export class DbAdapter {
    private static prisma: PrismaClient;

    static getClient() {
        if (!this.prisma) {
            this.prisma = new PrismaClient();
        }
        return this.prisma;
    }

    static async getPendingMarkets(): Promise<any[]> {
        try {
            const client = this.getClient();
            const records = await client.pendingMarket.findMany({
                include: { evaluations: true },
                orderBy: { createdAt: 'asc' }
            });
            return records;
        } catch (error) {
            Logger.error('[DB_ADAPTER] Error fetching pending markets', error);
            return [];
        }
    }

    static async addPendingMarket(proposal: any) {
        try {
            const client = this.getClient();
            await client.pendingMarket.create({
                data: {
                    signalId: proposal.signalId || String(Math.random()),
                    title: proposal.title || '',
                    category: proposal.category || '',
                    expiry: String(proposal.expiry || ''),
                    confidence: Number(proposal.confidence || 0),
                    sentiment: proposal.sentiment || '',
                    status: proposal.status || 'PENDING_APPROVAL',
                    evaluations: {
                        create: (proposal.evaluations || []).map((e: any) => ({
                            agentName: e.agentName,
                            vote: e.vote,
                            confidence: Number(e.confidence),
                            reasoning: e.reasoning
                        }))
                    }
                }
            });
            Logger.success(`[DB_ADAPTER] Stored proposal in database successfully: ${proposal.title}`);
        } catch (error) {
            Logger.error('[DB_ADAPTER] Error writing to database', error);
        }
    }

    static async saveEvidencePackage(pkg: any) {
        try {
            const client = this.getClient();
            await client.evidencePackage.create({
                data: {
                    signalId: pkg.signalId,
                    normalizedSignal: pkg.normalizedSignal,
                    sourceMetadata: pkg.sourceMetadata,
                    aiReasoningRef: pkg.aiReasoningRef,
                    confidenceInputs: Number(pkg.confidenceInputs || 0)
                }
            });
            Logger.success(`[DB_ADAPTER] Stored EvidencePackage in database successfully for signalId: ${pkg.signalId}`);
        } catch (error) {
            Logger.error('[DB_ADAPTER] Error writing EvidencePackage to database', error);
        }
    }

    static async clearPendingMarkets() {
        try {
            const client = this.getClient();
            await client.pendingMarket.deleteMany({});
            Logger.success('[DB_ADAPTER] Database pending markets cache cleared.');
        } catch (error) {
            Logger.error('[DB_ADAPTER] Error clearing database cache', error);
        }
    }
}
