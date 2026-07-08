import { EvidenceSerializer } from './serializer';
import { EvidenceValidator } from './validator';
import { Logger } from '../../utils/logger';

export interface EvidencePackagePayload {
    normalizedSignal: {
        category: string;
        topic: string;
        source: string;
        signal_strength: number;
        sentiment: string;
    };
    originalSource: string;
    agentOutputs: Array<{
        agentName: string;
        vote: string;
        confidence: number;
        reasoning: string;
    }>;
    reasoning: string;
    confidence: number;
    metadata: {
        protocol: string;
        version: string;
        release: string;
        build: string;
    };
    modelVersion: string;
    timestamp: string;
}

export class EvidenceService {
    /**
     * Compiles, serializes, hashes, and validates a unified protocol Evidence Package.
     */
    static async generatePackage(
        signal: any,
        evaluations: any[],
        consensusReasoning: string,
        consensusConfidence: number
    ): Promise<{ payload: EvidencePackagePayload; hash: string }> {
        
        const payload: EvidencePackagePayload = {
            normalizedSignal: {
                category: signal.category || 'misc',
                topic: signal.topic || '',
                source: signal.source || 'Unknown API',
                signal_strength: typeof signal.signal_strength === 'number' ? signal.signal_strength : 50,
                sentiment: signal.sentiment || 'neutral'
            },
            originalSource: signal.source || 'Unknown API',
            agentOutputs: (evaluations || []).map(e => ({
                agentName: e.agentName,
                vote: e.vote,
                confidence: typeof e.confidence === 'number' ? e.confidence : 0.5,
                reasoning: e.reasoning || ''
            })),
            reasoning: consensusReasoning,
            confidence: consensusConfidence,
            metadata: {
                protocol: 'AIRA Protocol',
                version: '2.4.0',
                release: 'v2',
                build: '124'
            },
            modelVersion: 'gpt-4o / gemini-1.5-flash / llama3-local',
            timestamp: new Date().toISOString()
        };

        // 1. Schema Validation
        if (!EvidenceValidator.validate(payload)) {
            throw new Error('[EVIDENCE_SERVICE] Evidence Package payload schema validation failed.');
        }

        // 2. Deterministic Alphabetical Serialization
        const serialized = EvidenceSerializer.serialize(payload);

        // 3. Cryptographic Hash Generation
        const hash = EvidenceSerializer.generateHash(serialized);

        Logger.success(`[EVIDENCE_SERVICE] Verifiable Evidence Package compiled successfully. SHA-256 Hash: ${hash}`);

        // Return the final prepared IPFS URI reference alongside the payload
        return {
            payload,
            hash: `ipfs://${hash}`
        };
    }
}
