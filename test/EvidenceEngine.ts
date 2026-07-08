import { EvidenceSerializer } from '../server/services/evidence/serializer';
import { EvidenceValidator } from '../server/services/evidence/validator';
import { EvidenceService } from '../server/services/evidence/service';
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

async function runTests() {
    Logger.start("Running Evidence Engine Test Suite...");

    // Test Case 1: Deterministic Serialization Sorting
    const objA = { b: 2, a: 1, c: { e: 5, d: 4 } };
    const objB = { c: { d: 4, e: 5 }, a: 1, b: 2 };
    
    const serializedA = EvidenceSerializer.serialize(objA);
    const serializedB = EvidenceSerializer.serialize(objB);
    
    assert(serializedA === serializedB, "Alphabetical key sorting results in identical serialized strings");
    
    // Test Case 2: Cryptographic SHA-256 Hash Matching
    const hashA = EvidenceSerializer.generateHash(serializedA);
    const hashB = EvidenceSerializer.generateHash(serializedB);
    
    assert(hashA === hashB, "Identical content layouts produce matching SHA-256 hashes");
    assert(hashA.length === 64, "SHA-256 hash length is exactly 64 characters");

    // Test Case 3: Package Validation Rules
    const validPayload = {
        normalizedSignal: { category: 'crypto', topic: 'Ethereum gas fees drop', source: 'Etherscan', signal_strength: 95, sentiment: 'bullish' },
        originalSource: 'Etherscan',
        agentOutputs: [{ agentName: 'AnalystAgent', vote: 'APPROVE', confidence: 0.90, reasoning: 'Strong indicators' }],
        reasoning: 'Consensus approved',
        confidence: 0.90,
        metadata: { protocol: 'AIRA', version: '2.0', release: 'v2', build: '100' },
        modelVersion: 'gpt-4o',
        timestamp: new Date().toISOString()
    };

    assert(EvidenceValidator.validate(validPayload) === true, "Validator approves schema-compliant payloads");

    const invalidPayload = { ...validPayload, reasoning: undefined };
    assert(EvidenceValidator.validate(invalidPayload) === false, "Validator rejects payloads missing required fields");

    const invalidTypePayload = { ...validPayload, confidence: "highly confident" };
    assert(EvidenceValidator.validate(invalidTypePayload) === false, "Validator rejects payloads with incorrect types");

    // Test Case 4: Evidence Package Compilation
    const signal = {
        category: "tech",
        topic: "Google launches Vertex AI enhancements",
        source: "Google Developer Blog",
        signal_strength: 92,
        sentiment: "bullish"
    };

    const evaluations = [
        { agentName: 'AnalystAgent', vote: 'APPROVE', confidence: 0.95, reasoning: 'Strong tech growth' },
        { agentName: 'RiskAgent', vote: 'APPROVE', confidence: 0.90, reasoning: 'Feasible timeline' },
        { agentName: 'ComplianceAgent', vote: 'APPROVE', confidence: 0.95, reasoning: 'Meets safety criteria' }
    ];

    const result = await EvidenceService.generatePackage(signal, evaluations, "Consensus approved by all agents", 0.933);
    assert(result.hash.startsWith('ipfs://'), "Compiled Evidence Package returns IPFS URI reference");
    assert(result.payload.normalizedSignal.topic === signal.topic, "Compiled package contains original signal parameters");
    assert(result.payload.agentOutputs.length === 3, "Compiled package includes all agent outputs");

    Logger.info(`\nTest Summary: ${testPassed} passed, ${testFailed} failed.`);
    if (testFailed > 0) {
        process.exit(1);
    } else {
        Logger.success("All Evidence Engine Integration Tests Passed Successfully!");
        process.exit(0);
    }
}

runTests().catch(err => {
    Logger.error("Error running tests", err);
    process.exit(1);
});
