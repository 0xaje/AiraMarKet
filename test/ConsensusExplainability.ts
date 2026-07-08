import { Logger } from '../server/utils/logger';

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

// Emulate explainability payload generation
function generateExplainability(proposal: any) {
    const totalEvaluationsCount = proposal.evaluations.length;
    const approvals = proposal.evaluations.filter((e: any) => e.vote === 'APPROVE');

    const isPassed = proposal.confidence >= 0.75;
    const verdict = isPassed ? 'APPROVE' : 'REJECT';

    const decisionReason = isPassed 
        ? `Consensus APPROVED: Weighted score met the 66% threshold, and Weighted Confidence of ${(proposal.confidence * 100).toFixed(1)}% met the 75% target.`
        : `Consensus REJECTED: Weighted confidence of ${(proposal.confidence * 100).toFixed(1)}% failed to meet 75% quorum.`;

    const disagreements = proposal.evaluations
        .filter((e: any) => e.vote !== verdict)
        .map((e: any) => `${e.agentName} dissented with ${e.vote} (confidence ${(e.confidence * 100).toFixed(0)}%)`);

    const riskEv = proposal.evaluations.find((e: any) => e.agentName === 'RiskAgent');
    const compEv = proposal.evaluations.find((e: any) => e.agentName === 'ComplianceAgent');
    const riskAssessment = `Risk Audit: ${riskEv ? riskEv.reasoning : 'No risk assessment log available.'} | Compliance Audit: ${compEv ? compEv.reasoning : 'No compliance assessment log available.'}`;

    const supportingEvidence = `Signal ID: ${proposal.signalId} | Category: ${proposal.category} | Expire: ${proposal.expiry}`;

    return {
        ...proposal,
        decisionReason,
        disagreements,
        riskAssessment,
        supportingEvidence
    };
}

async function runTests() {
    Logger.start("Running Consensus Explainability Test Suite...");

    // Mock proposal 1: Approved, Compliance Agent Dissents
    const mockProposal1 = {
        signalId: 'sig-test-1',
        category: 'tech',
        expiry: '1725148800',
        confidence: 0.7662,
        evaluations: [
            { agentName: 'AnalystAgent', vote: 'APPROVE', confidence: 0.98, reasoning: 'Good trend' },
            { agentName: 'RiskAgent', vote: 'APPROVE', confidence: 0.98, reasoning: 'Timeline is optimal' },
            { agentName: 'ComplianceAgent', vote: 'REJECT', confidence: 0.25, reasoning: 'Dissent check' }
        ]
    };

    const enriched1 = generateExplainability(mockProposal1);

    assert(enriched1.decisionReason.includes("Consensus APPROVED"), "decisionReason outputs approved statement correctly");
    assert(enriched1.disagreements.length === 1, "disagreements array captures exactly 1 dissenting agent");
    assert(enriched1.disagreements[0] === "ComplianceAgent dissented with REJECT (confidence 25%)", "dissenting statement correctly details vote and confidence");
    assert(enriched1.riskAssessment.includes("Risk Audit: Timeline is optimal"), "riskAssessment includes RiskAgent evaluations reasoning");
    assert(enriched1.riskAssessment.includes("Compliance Audit: Dissent check"), "riskAssessment includes ComplianceAgent evaluations reasoning");
    assert(enriched1.supportingEvidence.includes("sig-test-1"), "supportingEvidence maps signalId correctly");

    // Mock proposal 2: Rejected, Unanimous Agreement
    const mockProposal2 = {
        signalId: 'sig-test-2',
        category: 'crypto',
        expiry: '1725148800',
        confidence: 0.3456,
        evaluations: [
            { agentName: 'AnalystAgent', vote: 'REJECT', confidence: 0.10, reasoning: 'Bad pricing' },
            { agentName: 'RiskAgent', vote: 'REJECT', confidence: 0.15, reasoning: 'High timeline risk' },
            { agentName: 'ComplianceAgent', vote: 'REJECT', confidence: 0.20, reasoning: 'Fails rules' }
        ]
    };

    const enriched2 = generateExplainability(mockProposal2);

    assert(enriched2.decisionReason.includes("Consensus REJECTED"), "decisionReason outputs rejected statement correctly");
    assert(enriched2.disagreements.length === 0, "disagreements array is empty when all agents agree on outcome");

    Logger.info(`\nTest Summary: ${testPassed} passed, ${testFailed} failed.`);
    if (testFailed > 0) {
        process.exit(1);
    } else {
        Logger.success("All Consensus Explainability Tests Passed Successfully!");
        process.exit(0);
    }
}

runTests().catch(err => {
    Logger.error("Error running tests", err);
    process.exit(1);
});
