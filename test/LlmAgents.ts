import { eventBus, SystemEvents } from '../server/core/event_bus';
import { analystAgent } from '../server/agents/analyst_agent';
import { complianceAgent } from '../server/agents/compliance_agent';
import { riskAgent } from '../server/agents/risk_agent';
import { Logger } from '../server/utils/logger';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize all agents
analystAgent;
complianceAgent;
riskAgent;

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
    Logger.start("Running LLM Agent Integration Test Suite...");

    // Test Case 1: Valid Signal Processing & LLM Evaluations
    await new Promise<void>((resolve) => {
        const signal = {
            category: "tech" as const,
            topic: "Apple announces breakthrough neural engine processors",
            source: "Hacker News",
            timestamp: new Date().toISOString(),
            signal_strength: 85,
            sentiment: "bullish" as const
        };

        let analystDone = false;
        let complianceDone = false;
        let riskDone = false;

        const checkQuorum = () => {
            if (analystDone && complianceDone && riskDone) {
                resolve();
            }
        };

        eventBus.on(SystemEvents.EVALUATION_SUBMITTED, (evaluation: any) => {
            if (evaluation.agentName === 'AnalystAgent') {
                assert(evaluation.vote === 'APPROVE', 'AnalystAgent approved the positive tech signal');
                assert(evaluation.confidence > 0.70, 'AnalystAgent confidence is positive');
                analystDone = true;
            }
            if (evaluation.agentName === 'ComplianceAgent') {
                assert(evaluation.vote === 'APPROVE', 'ComplianceAgent approved the compliant signal');
                complianceDone = true;
            }
            if (evaluation.agentName === 'RiskAgent') {
                assert(evaluation.vote === 'APPROVE', 'RiskAgent approved the valid timeline signal');
                riskDone = true;
            }
            checkQuorum();
        });

        // Trigger agent pipeline
        Logger.info("[TEST] Emitting SIGNAL_RECEIVED to start the agent lifecycle...");
        eventBus.emit(SystemEvents.SIGNAL_RECEIVED, signal);
    });

    // Test Case 2: Verify Telemetry Logs Exist
    const logFile = path.join(__dirname, '../logs/llm_calls.log');
    assert(fs.existsSync(logFile), 'LLM call log file exists');
    if (fs.existsSync(logFile)) {
        const logs = fs.readFileSync(logFile, 'utf-8').trim().split('\n');
        assert(logs.length > 0, `Telemetry log entries captured successfully. Entries: ${logs.length}`);
    }

    Logger.info(`\nTest Summary: ${testPassed} passed, ${testFailed} failed.`);
    if (testFailed > 0) {
        process.exit(1);
    } else {
        Logger.success("All LLM Agent Integration Tests Passed Successfully!");
        process.exit(0);
    }
}

runTests().catch(err => {
    Logger.error("Error running tests", err);
    process.exit(1);
});
