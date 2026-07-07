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
                    title: proposal.title || '',
                    category: proposal.category || '',
                    expiry: String(proposal.expiry || ''),
                    confidence: Number(proposal.confidence || 0),
                    sentiment: proposal.sentiment || '',
                    status: proposal.status || 'PENDING_APPROVAL'
                }
            });
            Logger.success(`[DB_ADAPTER] Stored proposal in database successfully: ${proposal.title}`);
        } catch (error) {
            Logger.error('[DB_ADAPTER] Error writing to database', error);
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
