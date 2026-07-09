import { DbAdapter } from '../db_adapter';
import { EvidencePackagePayload } from './service';
import { Logger } from '../../utils/logger';

export class EvidenceRepository {
    static async save(signalId: string, payload: EvidencePackagePayload): Promise<void> {
        try {
            const client = DbAdapter.getClient();
            await client.evidencePackage.upsert({
                where: { signalId },
                update: {
                    normalizedSignal: JSON.stringify(payload.normalizedSignal),
                    sourceMetadata: JSON.stringify({
                        originalSource: payload.originalSource,
                        signalSources: payload.signalSources,
                        metadata: payload.metadata,
                        provider: payload.provider,
                        cid: payload.cid,
                        sha256Hash: payload.sha256Hash
                    }),
                    aiReasoningRef: JSON.stringify({
                        reasoning: payload.reasoning,
                        aiInputs: payload.aiInputs,
                        agentOutputs: payload.agentOutputs,
                        consensus: payload.consensus,
                        modelVersion: payload.modelVersion
                    }),
                    confidenceInputs: Number(payload.confidence || 0)
                },
                create: {
                    signalId,
                    normalizedSignal: JSON.stringify(payload.normalizedSignal),
                    sourceMetadata: JSON.stringify({
                        originalSource: payload.originalSource,
                        signalSources: payload.signalSources,
                        metadata: payload.metadata,
                        provider: payload.provider,
                        cid: payload.cid,
                        sha256Hash: payload.sha256Hash
                    }),
                    aiReasoningRef: JSON.stringify({
                        reasoning: payload.reasoning,
                        aiInputs: payload.aiInputs,
                        agentOutputs: payload.agentOutputs,
                        consensus: payload.consensus,
                        modelVersion: payload.modelVersion
                    }),
                    confidenceInputs: Number(payload.confidence || 0)
                }
            });
            Logger.success(`[EVIDENCE_REPOSITORY] Saved Evidence Package verifiably for signalId: ${signalId}`);
        } catch (error) {
            Logger.error('[EVIDENCE_REPOSITORY] Error saving Evidence Package', error);
            throw error;
        }
    }

    static async getBySignalId(signalId: string): Promise<any | null> {
        try {
            const client = DbAdapter.getClient();
            const record = await client.evidencePackage.findUnique({
                where: { signalId }
            });
            if (!record) return null;
            return {
                id: record.id,
                signalId: record.signalId,
                normalizedSignal: JSON.parse(record.normalizedSignal),
                sourceMetadata: JSON.parse(record.sourceMetadata),
                aiReasoningRef: JSON.parse(record.aiReasoningRef),
                confidenceInputs: record.confidenceInputs,
                createdAt: record.createdAt
            };
        } catch (error) {
            Logger.error(`[EVIDENCE_REPOSITORY] Error fetching Evidence Package for signalId: ${signalId}`, error);
            return null;
        }
    }

    static async getAll(): Promise<any[]> {
        try {
            const client = DbAdapter.getClient();
            const records = await client.evidencePackage.findMany({
                orderBy: { createdAt: 'desc' }
            });
            return records.map(record => ({
                id: record.id,
                signalId: record.signalId,
                normalizedSignal: JSON.parse(record.normalizedSignal),
                sourceMetadata: JSON.parse(record.sourceMetadata),
                aiReasoningRef: JSON.parse(record.aiReasoningRef),
                confidenceInputs: record.confidenceInputs,
                createdAt: record.createdAt
            }));
        } catch (error) {
            Logger.error('[EVIDENCE_REPOSITORY] Error fetching all Evidence Packages', error);
            return [];
        }
    }
}
