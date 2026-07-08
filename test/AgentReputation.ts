import { reputationService } from '../server/services/reputation_service';
import { Logger } from '../server/utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    Logger.start("Running Agent Reputation System Test Suite...");

    const logFile = path.join(__dirname, '../logs/agent_reputation.json');
    if (fs.existsSync(logFile)) {
        fs.unlinkSync(logFile);
    }

    // Test Case 1: Initial Default Values
    const analystRep = await reputationService.getReputation('AnalystAgent');
    assert(analystRep.reputationScore === 100, "Analyst agent starts with a perfect 100 reputation");
    assert(analystRep.totalEvaluations === 0, "Analyst agent starts with 0 evaluations");
    assert(analystRep.currentWeight === 1.2, "Analyst agent starts with a default weight of 1.2");

    // Test Case 2: Dynamic Weight Scaling After Consensus Round
    // Simulate a round where Analyst and Risk approved, but Compliance rejected
    // Final consensus outcome is APPROVED
    const votes = [
        { agentName: 'AnalystAgent', vote: 'APPROVE', confidence: 0.90 },
        { agentName: 'RiskAgent', vote: 'APPROVE', confidence: 0.95 },
        { agentName: 'ComplianceAgent', vote: 'REJECT', confidence: 0.20 }
    ];

    await reputationService.recordConsensusRound(votes, 'APPROVE');

    // Load updated profiles
    const updatedAnalyst = await reputationService.getReputation('AnalystAgent');
    const updatedCompliance = await reputationService.getReputation('ComplianceAgent');

    // Assert Analyst stats (matched, stays at 100)
    assert(updatedAnalyst.totalEvaluations === 1, "Analyst total evaluations incremented to 1");
    assert(updatedAnalyst.successfulProposals === 1, "Analyst successful proposals set to 1");
    assert(updatedAnalyst.reputationScore === 100, "Analyst reputation score remains at 100");
    assert(updatedAnalyst.currentWeight === 1.2, "Analyst weight remains at 1.2");

    // Assert Compliance stats (mismatched, penalised)
    assert(updatedCompliance.totalEvaluations === 1, "Compliance total evaluations incremented to 1");
    assert(updatedCompliance.failedProposals === 1, "Compliance failed proposals set to 1");
    assert(updatedCompliance.reputationScore === 0, "Compliance reputation score drops to 0");
    assert(updatedCompliance.currentWeight === 0.5, "Compliance consensus weight drops to minimum floor (0.5)");
    assert(updatedCompliance.falseNegatives === 1, "Compliance captures 1 falseNegative count");

    // Test Case 3: Dynamic Parameters Retrieval for Future Consensus
    const params = reputationService.getReputationParams('ComplianceAgent');
    assert(params.weight === 0.5, "Consensus service retrieves the penalised dynamic weight");
    assert(params.historicalAccuracy === 0.0, "Consensus service retrieves the penalised agreement rate");

    // Test Case 4: API Payload Outputs
    const allReputations = await reputationService.getAllReputations();
    assert(allReputations.length === 3, "GET /api/reputation payload returns stats for all 3 agents");

    Logger.info(`\nTest Summary: ${testPassed} passed, ${testFailed} failed.`);
    if (testFailed > 0) {
        process.exit(1);
    } else {
        Logger.success("All Agent Reputation Integration Tests Passed Successfully!");
        process.exit(0);
    }
}

runTests().catch(err => {
    Logger.error("Error running tests", err);
    process.exit(1);
});
