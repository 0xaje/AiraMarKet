import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { DbAdapter } from './db_adapter';
import { Logger } from '../utils/logger';

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(__dirname, '../../cache');
const CACHE_FILE = path.join(CACHE_DIR, 'pending_markets.json');

// Toggle between filesystem cache and relational database via Prisma
const USE_PRISMA = process.env.USE_PRISMA === 'true';

export class MarketCache {
    private static ensureCacheExists() {
        if (!fs.existsSync(CACHE_DIR)) {
            fs.mkdirSync(CACHE_DIR, { recursive: true });
        }
        if (!fs.existsSync(CACHE_FILE)) {
            fs.writeFileSync(CACHE_FILE, JSON.stringify([]), 'utf-8');
        }
    }

    static async getPendingMarkets(): Promise<any[]> {
        if (USE_PRISMA) {
            Logger.info('[MARKET_CACHE] Fetching pending markets from database...');
            return await DbAdapter.getPendingMarkets();
        }
        try {
            this.ensureCacheExists();
            const data = fs.readFileSync(CACHE_FILE, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            Logger.error('[MARKET_CACHE] Error reading cache file', error);
            return [];
        }
    }

    static async addPendingMarket(proposal: any) {
        if (USE_PRISMA) {
            Logger.info('[MARKET_CACHE] Storing proposal in database...');
            await DbAdapter.addPendingMarket(proposal);
            return;
        }
        try {
            this.ensureCacheExists();
            const data = fs.readFileSync(CACHE_FILE, 'utf-8');
            const markets = JSON.parse(data) || [];
            markets.push(proposal);
            fs.writeFileSync(CACHE_FILE, JSON.stringify(markets, null, 2), 'utf-8');
            Logger.success(`[MARKET_CACHE] Proposal stored securely in filesystem database cache: ${proposal.title}`);
        } catch (error) {
            Logger.error('[MARKET_CACHE] Error writing to cache file', error);
        }
    }

    static async clearPendingMarkets() {
        if (USE_PRISMA) {
            Logger.info('[MARKET_CACHE] Clearing pending markets in database...');
            await DbAdapter.clearPendingMarkets();
            return;
        }
        try {
            this.ensureCacheExists();
            fs.writeFileSync(CACHE_FILE, JSON.stringify([]), 'utf-8');
            Logger.success('[MARKET_CACHE] Pending markets filesystem cache cleared.');
        } catch (error) {
            Logger.error('[MARKET_CACHE] Error clearing cache file', error);
        }
    }
}
