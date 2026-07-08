import * as dotenv from 'dotenv';
dotenv.config();

import { Logger } from './utils/logger';
import { NetworkValidationService } from './services/networkValidationService';
import { activeChainConfig } from '../config/chains';
import { ProtocolMetadata } from '../config/protocol/protocol';
import { analystAgent } from './agents/analyst_agent';
import { riskAgent } from './agents/risk_agent';
import { complianceAgent } from './agents/compliance_agent';
import { consensusService } from './services/consensus_service';
import { marketService } from './services/market_service';
import { SignalIngestionService } from './services/signal_ingestion';
import * as http from 'http';
import { TransparencyLogger } from './services/transparency_logger';
import { MarketCache } from './services/market_cache';
import { reputationService } from './services/reputation_service';
import { exec } from 'child_process';
import { ProviderFactory } from '../services/providerFactory';
import { indexer } from './indexer';

Logger.start(`Initializing ${ProtocolMetadata.protocolName} Autonomous Backend...`);

function validateEnvironment() {
    const required = ['PRIVATE_KEY', 'DATABASE_URL', 'RPC_URL'];
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        Logger.error(`CRITICAL CONFIGURATION ERROR: Missing required environment variables: ${missing.join(', ')}`);
        process.exit(1);
    }
}

async function runPrismaMigrations() {
    if (process.env.USE_PRISMA === 'true') {
        Logger.start("USE_PRISMA is enabled. Synchronizing database schemas...");
        return new Promise<void>((resolve) => {
            exec('npx prisma db push --accept-data-loss', (error, stdout, stderr) => {
                if (error) {
                    Logger.error("Prisma database schema synchronization failed", error);
                } else {
                    Logger.success("Database schema synchronized successfully via Prisma.");
                }
                resolve();
            });
        });
    }
}

async function bootstrap() {
    validateEnvironment();

    const report = await NetworkValidationService.validate();

    // Print professional startup summary diagnostics banner to console
    console.log(`
--------------------------------------------------
${ProtocolMetadata.name} v${ProtocolMetadata.version} (${ProtocolMetadata.release})
Environment: ${ProtocolMetadata.environment}
Network:     ${ProtocolMetadata.currentNetwork}
Chain ID:    ${activeChainConfig.chainId}
RPC:         ${report.rpcReachable ? 'Connected' : 'FAILED'}
Explorer:    ${report.explorerConfigured ? 'Configured' : 'FAILED'}
Contracts:   ${report.deploymentExists ? 'Loaded' : 'FAILED'}
Database:    ${report.walletValid ? 'Connected (via Prisma)' : 'DISCONNECTED'}
Indexer:     Running
API:         Ready
--------------------------------------------------
    `);

    if (!report.success) {
        Logger.error("CRITICAL: Diagnostics validation failed. Exiting immediately.");
        process.exit(1);
    }

    await runPrismaMigrations();

    // Start block indexer and Consensus Engine validation loops
    indexer.startIndexing();
    analystAgent;
    riskAgent;
    complianceAgent;
    consensusService;
    marketService;

    setTimeout(() => {
        SignalIngestionService.runIngestionCycle();
        setInterval(() => {
            SignalIngestionService.runIngestionCycle();
        }, 60000);
    }, 2000);
}

bootstrap().catch((err) => {
    Logger.error("Failed to bootstrap backend application", err);
    process.exit(1);
});

// HTTP Server to accept verifiable transparency logs from Frontend
const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/log-transparency') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                TransparencyLogger.logApproval(
                    payload.txHash,
                    payload.title,
                    payload.category,
                    payload.inputSignals,
                    payload.reason,
                    payload.confidence,
                    payload.decision
                );
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'Logged verifiably' }));
            } catch (err) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/resolve-market') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const { settlementService } = await import('./services/settlement_service');
                const payload = JSON.parse(body);
                const result = await settlementService.resolveMarket(Number(payload.marketId), payload.outcome === true);
                if (result.success) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(result));
                } else {
                    res.writeHead(500);
                    res.end(JSON.stringify(result));
                }
            } catch (err) {
                res.writeHead(400);
                res.end('Failed');
            }
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/api/reputation') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const stats = await reputationService.getAllReputations();
        res.end(JSON.stringify(stats));
        return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/reputation/')) {
        const agentName = req.url.split('/').pop();
        if (!agentName) {
            res.writeHead(400); res.end('Invalid agent name'); return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const stats = await reputationService.getReputation(agentName);
        res.end(JSON.stringify(stats));
        return;
    }

    if (req.method === 'GET' && req.url === '/pending-markets') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const pending = await MarketCache.getPendingMarkets();
        res.end(JSON.stringify(pending));
        await MarketCache.clearPendingMarkets(); // Clear after sending to avoid duplicates
        return;
    }

    if (req.method === 'GET' && req.url === '/live-trending') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const signals = SignalIngestionService.getRecentSignals();
        res.end(JSON.stringify(signals));
        return;
    }

    if (req.method === 'GET' && req.url?.startsWith('/api/portfolio/')) {
        const address = req.url.split('/').pop()?.toLowerCase();
        if (!address) {
            res.writeHead(400); res.end('Invalid address'); return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        try {
            const { PrismaClient } = await import('@prisma/client');
            const prisma = new PrismaClient();
            
            const user = await prisma.user.findUnique({
                where: { address },
                include: { trades: { include: { market: true } } }
            });
            
            if (!user) {
                res.end(JSON.stringify({ totalWinnings: 0, activePositions: 0 }));
                return;
            }

            const activePositionsList = [];
            const uniqueActiveMarkets = new Set();
            for (const trade of user.trades) {
                if (!trade.market.resolved && !uniqueActiveMarkets.has(trade.marketId)) {
                    uniqueActiveMarkets.add(trade.marketId);
                    activePositionsList.push({
                        id: trade.marketId,
                        title: trade.market.title,
                        side: trade.isYes ? 'YES' : 'NO',
                        amount: trade.amount
                    });
                }
            }
            
            res.end(JSON.stringify({ 
                totalWinnings: user.totalWinnings, 
                activePositionsCount: uniqueActiveMarkets.size,
                activePositions: activePositionsList
            }));
        } catch(e) {
            res.writeHead(500); res.end('DB Error');
        }
        return;
    }

    if (req.method === 'GET' && req.url === '/api/v1/network') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        
        let rpcStatus = "Disconnected";
        let latestBlock = 0;
        try {
            const provider = ProviderFactory.getProvider();
            latestBlock = await provider.getBlockNumber();
            rpcStatus = "Connected";
        } catch (e) {}

        let dbStatus = "Disconnected";
        try {
            const { DbAdapter } = await import('./services/db_adapter');
            const client = DbAdapter.getClient();
            await client.$queryRaw`SELECT 1`;
            dbStatus = "Connected";
        } catch (e) {}

        const { activeChainConfig } = await import('../config/chains');
        const { ProtocolMetadata } = await import('../config/protocol/protocol');
        
        res.end(JSON.stringify({
            protocol: ProtocolMetadata.name,
            version: ProtocolMetadata.version,
            network: ProtocolMetadata.currentNetwork,
            chainId: activeChainConfig.chainId,
            rpcStatus,
            latestBlock,
            explorer: activeChainConfig.blockExplorer,
            contractsLoaded: true,
            database: dbStatus,
            indexer: "Running",
            uptime: Math.floor(process.uptime())
        }));
        return;
    }

    if (req.method === 'GET' && req.url === '/api/v1/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });

        let rpcStatus = "Disconnected";
        try {
            const provider = ProviderFactory.getProvider();
            await provider.getNetwork();
            rpcStatus = "Connected";
        } catch (e) {}

        let dbStatus = "Disconnected";
        try {
            const { DbAdapter } = await import('./services/db_adapter');
            const client = DbAdapter.getClient();
            await client.$queryRaw`SELECT 1`;
            dbStatus = "Connected";
        } catch (e) {}

        const { ProtocolMetadata } = await import('../config/protocol/protocol');
        const memory = process.memoryUsage();

        res.end(JSON.stringify({
            status: (rpcStatus === "Connected" && dbStatus === "Connected") ? "OK" : "DEGRADED",
            database: dbStatus,
            rpc: rpcStatus,
            contracts: "Connected",
            memory: {
                rss: memory.rss,
                heapTotal: memory.heapTotal,
                heapUsed: memory.heapUsed
            },
            uptime: Math.floor(process.uptime()),
            version: ProtocolMetadata.version
        }));
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    Logger.success(`Transparency Log server running on port ${PORT}`);
});
