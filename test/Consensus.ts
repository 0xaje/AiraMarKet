import { eventBus, SystemEvents } from '../server/core/event_bus';
import { consensusService } from '../server/services/consensus_service';
import { Logger } from '../server/utils/logger';

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
    Logger.start("Running Consensus Service Test Suite...");

    // Test Case 1: Quorum with Approvals (Consensus Success)
    await new Promise<void>((resolve) => {
        const signalId = 'sig-test-1';
        
        eventBus.once(SystemEvents.MARKET_APPROVED, (proposal) => {
            assert(proposal.signalId === signalId, 'Emitted signalId should match proposal');
            assert(proposal.confidence === 0.88, 'Calculated average confidence should match approvals');
            assert(proposal.sentiment === 'BULLISH', 'Consolidated sentiment should be set');
            assert(proposal.evaluations.length === 3, 'All 3 agent evaluations should be attached');
            resolve();
        });

        // Emit 3 evaluations (2 approvals, 1 rejection - ratio 66.7%)
        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId,
            agentName: 'AnalystAgent',
            title: 'Will SpaceX land Starship?',
            category: 'tech',
            expiry: '1725148800',
            sentiment: 'BULLISH',
            vote: 'APPROVE',
            confidence: 0.80,
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
            confidence: 0.96,
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
            confidence: 0.20,
            reasoning: 'Restricted term check failed'
        });
    });

    // Test Case 2: Quorum with Rejections (Consensus Failure)
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
            eventBus.off(SystemEvents.MARKET_APPROVED, onApproved);
            assert(!approvedTriggered, 'Market approval should NOT trigger if consensus is rejected');
            resolve();
        }, 500);
    });

    Logger.info(`\nTest Summary: ${testPassed} passed, ${testFailed} failed.`);
    if (testFailed > 0) {
        process.exit(1);
    } else {
        Logger.success("Consensus Service Integration Tests Passed Successfully!");
        process.exit(0);
    }
}

runTests().catch(err => {
    Logger.error("Unhandle test crash", err);
    process.exit(1);
});
