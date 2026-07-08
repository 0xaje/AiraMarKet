import { eventBus, SystemEvents } from '../server/core/event_bus';
import { consensusService } from '../server/services/consensus_service';
import { Logger } from '../server/utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force initialize consensusService listeners
consensusService;

let testPassed = 0;
let testFailed = 0;

function assert(condition: boolean, message: string) {
    if (!condition) {
        testFailed++;
        Logger.error(`[TEST_FAILURE] Assertion failed: ${message}`);
    } else {
        testPassed++;
        Logger.success(`[TEST_SUCCESS] ${message}`);
    }
}

async function runTests() {
    Logger.start("Running Upgraded Consensus Service Test Suite...");

    const logFile = path.join(__dirname, '../logs/agent_reputation.json');
    if (fs.existsSync(logFile)) {
        fs.unlinkSync(logFile);
    }

    // Test Case 1: Weighted Quorum with Approvals (Consensus Success)
    await new Promise<void>((resolve) => {
        const signalId = 'sig-test-1';
        
        eventBus.once(SystemEvents.MARKET_APPROVED, (proposal) => {
            assert(proposal.signalId === signalId, 'Emitted signalId should match proposal');
            assert(Math.abs(proposal.confidence - 0.7662) < 0.0001, `Calculated weighted confidence (${proposal.confidence}) matches expected adjusted pool confidence (0.7662)`);
            assert(proposal.sentiment === 'BULLISH', 'Consolidated sentiment should be set');
            assert(proposal.evaluations.length === 3, 'All 3 agent evaluations should be attached');
            resolve();
        });

        // Emit 3 evaluations (2 approvals, 1 rejection)
        // Weighted score = (1.2 * 0.92 + 1.5 * 0.88) / (1.2 * 0.92 + 1.5 * 0.88 + 1.0 * 0.95) = 2.424 / 3.374 = 0.7184 (>= 0.66)
        // Weighted confidence = (0.98 * 1.2 * 1.0 + 0.98 * 1.5 * 0.95 + 0.25 * 1.0 * 1.05) / 3.7 = (1.176 + 1.3965 + 0.2625) / 3.7 = 2.835 / 3.7 = 0.7662 (>= 0.75)
        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId,
            agentName: 'AnalystAgent',
            title: 'Will SpaceX land Starship?',
            category: 'tech',
            expiry: '1725148800',
            sentiment: 'BULLISH',
            vote: 'APPROVE',
            confidence: 0.98,
            reasoning: 'Good trend signals'
        });

        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId,
            agentName: 'RiskAgent',
            title: 'Will SpaceX land Starship?',
            category: 'tech',
            expiry: '1725148800',
            sentiment: 'BULLISH',
            vote: 'APPROVE',
            confidence: 0.98,
            reasoning: 'Timeline is optimal'
        });

        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId,
            agentName: 'ComplianceAgent',
            title: 'Will SpaceX land Starship?',
            category: 'tech',
            expiry: '1725148800',
            sentiment: 'BULLISH',
            vote: 'REJECT',
            confidence: 0.25,
            reasoning: 'Restricted term check failed'
        });
    });

    // Test Case 2: Weighted Quorum with Rejections (Consensus Failure)
    await new Promise<void>((resolve) => {
        const signalId = 'sig-test-2';
        let approvedTriggered = false;

        const onApproved = (proposal: any) => {
            if (proposal.signalId === signalId) {
                approvedTriggered = true;
            }
        };

        eventBus.on(SystemEvents.MARKET_APPROVED, onApproved);

        // Emit 3 evaluations (2 rejections, 1 approval)
        // Weighted score = (1.0 * 0.95) / 3.374 = 0.2816 (< 0.66)
        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId,
            agentName: 'AnalystAgent',
            title: 'Will BTC drop to $1?',
            category: 'crypto',
            expiry: '1725148800',
            sentiment: 'BEARISH',
            vote: 'REJECT',
            confidence: 0.10,
            reasoning: 'Highly unlikely'
        });

        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId,
            agentName: 'RiskAgent',
            title: 'Will BTC drop to $1?',
            category: 'crypto',
            expiry: '1725148800',
            sentiment: 'BEARISH',
            vote: 'REJECT',
            confidence: 0.15,
            reasoning: 'Timeline holds no pricing risk viability'
        });

        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId,
            agentName: 'ComplianceAgent',
            title: 'Will BTC drop to $1?',
            category: 'crypto',
            expiry: '1725148800',
            sentiment: 'BEARISH',
            vote: 'APPROVE',
            confidence: 0.90,
            reasoning: 'Compliant structure'
        });

        setTimeout(() => {
            assert(!approvedTriggered, 'Market approval should NOT trigger if weighted consensus score falls below threshold');
            eventBus.off(SystemEvents.MARKET_APPROVED, onApproved);
            resolve();
        }, 100);
    });

    Logger.info(`\nTest Summary: ${testPassed} passed, ${testFailed} failed.`);
    if (testFailed > 0) {
        process.exit(1);
    } else {
        Logger.success("All Upgraded Consensus Service Integration Tests Passed Successfully!");
        process.exit(0);
    }
}

runTests().catch(err => {
    Logger.error("Error running tests", err);
    process.exit(1);
});
