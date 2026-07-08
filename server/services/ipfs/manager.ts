import { IpfsProvider, IpfsUploadResult } from './types';
import { PinataProvider, Web3StorageProvider, LocalNodeProvider } from './providers';
import { TransparencyLogger } from '../transparency_logger';
import { Logger } from '../../utils/logger';

export class IpfsManager {
    private static instance: IpfsManager;
    private providers: IpfsProvider[] = [];

    private constructor() {
        // Preferred upload provider sequence
        this.providers = [
            new PinataProvider(),
            new Web3StorageProvider(),
            new LocalNodeProvider()
        ];
    }

    public static getInstance(): IpfsManager {
        if (!this.instance) {
            this.instance = new IpfsManager();
        }
        return this.instance;
    }

    /**
     * Validates if a string matches standard IPFS CIDv0 or CIDv1 formats
     */
    public isValidCid(cid: string): boolean {
        if (!cid) return false;
        // CIDv0 (Qm... length 46) or CIDv1 (bafy... length 59)
        const cidRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{55,59})$/;
        return cidRegex.test(cid);
    }

    /**
     * Uploads Evidence Package JSON payload to IPFS.
     * Integrates pluggable adapters, retry policies, CID validators, and telemetry logs.
     */
    public async upload(data: any): Promise<string> {
        const activeProviders = this.providers.filter(p => p.isActive());
        if (activeProviders.length === 0) {
            throw new Error('[IPFS_MANAGER] No active IPFS upload providers configured.');
        }

        let lastError: any = null;

        for (const provider of activeProviders) {
            Logger.info(`[IPFS_MANAGER] Attempting upload via provider: ${provider.name}...`);
            
            const maxRetries = 2; // Try original + 2 retries = 3 attempts total
            for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
                const startTime = Date.now();
                try {
                    const cid = await this.executeWithTimeout(provider.uploadJson(data), 5000);
                    const latencyMs = Date.now() - startTime;

                    // CID Verification Guard
                    if (!this.isValidCid(cid)) {
                        throw new Error(`Invalid Content Identifier (CID) returned: "${cid}"`);
                    }

                    // Save telemetry metrics (success)
                    const metrics: IpfsUploadResult = {
                        cid,
                        provider: provider.name,
                        latencyMs,
                        timestamp: new Date().toISOString()
                    };
                    TransparencyLogger.logIpfsUpload(metrics);

                    return cid;

                } catch (error: any) {
                    const latencyMs = Date.now() - startTime;
                    const errorMsg = error.message || String(error);
                    Logger.warn(`[IPFS_MANAGER] Provider ${provider.name} attempt ${attempt} failed: ${errorMsg}`);

                    // Save telemetry metrics (error)
                    const metrics: IpfsUploadResult = {
                        cid: 'N/A',
                        provider: provider.name,
                        latencyMs,
                        error: errorMsg,
                        timestamp: new Date().toISOString()
                    };
                    TransparencyLogger.logIpfsUpload(metrics);

                    lastError = error;

                    if (attempt <= maxRetries) {
                        const delay = attempt * 100;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
        }

        throw new Error(`[IPFS_MANAGER] All configured IPFS upload providers failed. Last Error: ${lastError?.message || lastError}`);
    }

    /**
     * Helper to wrap a promise in a timeout guard
     */
    private async executeWithTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
        return Promise.race([
            promise,
            new Promise<T>((_, reject) =>
                setTimeout(() => reject(new Error('Provider request timeout')), timeoutMs)
            )
        ]);
    }
}

export const ipfsManager = IpfsManager.getInstance();
