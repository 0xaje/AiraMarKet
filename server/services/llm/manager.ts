import crypto from 'crypto';
import { LlmProvider, LlmEvaluationResponse, LlmCallMetrics } from './types';
import { OpenAiProvider, GeminiProvider, AnthropicProvider, LocalLlamaProvider } from './providers';
import { TransparencyLogger } from '../transparency_logger';
import { Logger } from '../../utils/logger';

export class LlmManager {
    private static instance: LlmManager;
    private providers: LlmProvider[] = [];
    private cache: Map<string, LlmEvaluationResponse> = new Map();

    private constructor() {
        // Order of preferred providers (fallbacks)
        this.providers = [
            new OpenAiProvider(),
            new GeminiProvider(),
            new AnthropicProvider(),
            new LocalLlamaProvider()
        ];
    }

    public static getInstance(): LlmManager {
        if (!this.instance) {
            this.instance = new LlmManager();
        }
        return this.instance;
    }

    private getCacheKey(prompt: string): string {
        return crypto.createHash('sha256').update(prompt).digest('hex');
    }

    /**
     * Executes prompt analysis via configured LLMs.
     * Implements Retry, Caching, Fallbacks, Timeouts, and Telemetry Logging.
     */
    public async analyze(prompt: string): Promise<LlmEvaluationResponse> {
        const cacheKey = this.getCacheKey(prompt);
        
        // 1. Caching Guard
        if (this.cache.has(cacheKey)) {
            Logger.info('[LLM_MANAGER] Cache hit for prompt analysis.');
            return this.cache.get(cacheKey)!;
        }

        // Filter for active providers
        const activeProviders = this.providers.filter(p => p.isActive());
        if (activeProviders.length === 0) {
            throw new Error('[LLM_MANAGER] No active LLM providers configured.');
        }

        let lastError: any = null;

        // 2. Fallback Chain Loop
        for (const provider of activeProviders) {
            Logger.info(`[LLM_MANAGER] Attempting analysis via provider: ${provider.name} (${provider.model})...`);
            
            // Try logic with retries
            const maxRetries = 2; // Try original + 2 retries = 3 attempts total
            for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
                const startTime = Date.now();
                try {
                    // Execute provider query with execution timeout wrapper
                    const response = await this.executeWithTimeout(provider.analyze(prompt), 5000);
                    const latencyMs = Date.now() - startTime;

                    // Log telemetry metrics (success)
                    const metrics: LlmCallMetrics = {
                        provider: provider.name,
                        model: provider.model,
                        latencyMs,
                        tokensUsed: 150 + Math.floor(Math.random() * 80), // Simulated token usage count
                        timestamp: new Date().toISOString()
                    };
                    TransparencyLogger.logLlmCall(metrics);

                    // Update Cache
                    this.cache.set(cacheKey, response);
                    return response;

                } catch (error: any) {
                    const latencyMs = Date.now() - startTime;
                    const errorMsg = error.message || String(error);
                    Logger.warn(`[LLM_MANAGER] Provider ${provider.name} attempt ${attempt} failed: ${errorMsg}`);

                    // Log telemetry metrics (error)
                    const metrics: LlmCallMetrics = {
                        provider: provider.name,
                        model: provider.model,
                        latencyMs,
                        error: errorMsg,
                        timestamp: new Date().toISOString()
                    };
                    TransparencyLogger.logLlmCall(metrics);

                    lastError = error;
                    
                    // Basic rate limiting or exponential backoff delay before retry
                    if (attempt <= maxRetries) {
                        const delay = attempt * 100;
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
        }

        throw new Error(`[LLM_MANAGER] All configured LLM providers failed. Last Error: ${lastError?.message || lastError}`);
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

export const llmManager = LlmManager.getInstance();
