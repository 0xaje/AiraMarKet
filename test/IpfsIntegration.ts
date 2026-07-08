import { ipfsManager } from '../server/services/ipfs/manager';
import { IpfsProvider } from '../server/services/ipfs/types';
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

// -------------------------------------------------------------
// Mock IPFS Provider to test Retry Logic
// -------------------------------------------------------------
class MockUnstableProvider implements IpfsProvider {
    name = 'MockUnstableProvider';
    attempts = 0;
    
    isActive(): boolean {
        return true;
    }

    async uploadJson(data: any): Promise<string> {
        this.attempts++;
        if (this.attempts < 3) {
            throw new Error(`Simulation failure attempt #${this.attempts}`);
        }
        return 'QmRJYvUptYQ723JtXj6dKsz2r11x7c8g9h1m2n3p4q5r6s';
    }
}

async function runTests() {
    Logger.start("Running IPFS Integration & Pluggable Providers Test Suite...");

    // Test Case 1: CID Format Validation Rules
    assert(ipfsManager.isValidCid('QmRJYvUptYQ723JtXj6dKsz2r11x7c8g9h1m2n3p4q5r6s') === true, 'Validates authentic Qm... CIDv0 hash');
    assert(ipfsManager.isValidCid('bafybeigdy3uf5xay752v7gf6u52474fec4h6sciymu6tr67b6vy67fd74u') === true, 'Validates authentic bafy... CIDv1 hash');
    assert(ipfsManager.isValidCid('invalid-cid-hash-string') === false, 'Rejects invalid random text string');
    assert(ipfsManager.isValidCid('') === false, 'Rejects empty string');

    // Test Case 2: E2E Live Upload (using Simulation Fallback)
    const payload = {
        title: "Test IPFS Evidence Upload",
        category: "politics",
        timestamp: new Date().toISOString(),
        mockData: [1, 2, 3]
    };

    const cid = await ipfsManager.upload(payload);
    assert(ipfsManager.isValidCid(cid), `E2E live upload yields a valid format CID: ${cid}`);

    // Test Case 3: Telemetry Log Persistence Checks
    const logFile = path.join(__dirname, '../logs/ipfs_uploads.log');
    assert(fs.existsSync(logFile), 'IPFS upload log file exists');
    if (fs.existsSync(logFile)) {
        const logs = fs.readFileSync(logFile, 'utf-8').trim().split('\n');
        assert(logs.length > 0, `Telemetry log entries captured successfully. Entries: ${logs.length}`);
    }

    // Test Case 4: Pluggable Provider Retry Policies
    const unstableProvider = new MockUnstableProvider();
    // Temporarily register unstable provider on the manager instance
    const originalProviders = (ipfsManager as any).providers;
    (ipfsManager as any).providers = [unstableProvider];

    try {
        Logger.info("[TEST] Starting unstable provider retry testing (should retry and succeed on attempt #3)...");
        const retryCid = await ipfsManager.upload({ test: 'retry' });
        assert(retryCid === 'QmRJYvUptYQ723JtXj6dKsz2r11x7c8g9h1m2n3p4q5r6s', 'Manager retried successfully and compiled response on attempt 3');
        assert(unstableProvider.attempts === 3, 'Exactly 3 attempts were executed before success');
    } catch (err: any) {
        testFailed++;
        Logger.error(`Retry policy test failed: ${err.message}`);
    } finally {
        // Restore original providers list
        (ipfsManager as any).providers = originalProviders;
    }

    Logger.info(`\nTest Summary: ${testPassed} passed, ${testFailed} failed.`);
    if (testFailed > 0) {
        process.exit(1);
    } else {
        Logger.success("All IPFS Integration Tests Passed Successfully!");
        process.exit(0);
    }
}

runTests().catch(err => {
    Logger.error("Error running tests", err);
    process.exit(1);
});
