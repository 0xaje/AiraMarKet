export class EvidenceValidator {
    /**
     * Validates if the object structure meets all protocol Evidence Package requirements
     */
    static validate(payload: any): boolean {
        if (!payload) return false;
        
        const requiredFields = [
            'normalizedSignal',
            'originalSource',
            'signalSources',
            'aiInputs',
            'agentOutputs',
            'reasoning',
            'confidence',
            'consensus',
            'metadata',
            'modelVersion',
            'timestamp',
            'promptHash',
            'agentIds',
            'provider',
            'cid',
            'sha256Hash'
        ];

        // 1. Check for required properties
        for (const field of requiredFields) {
            if (payload[field] === undefined || payload[field] === null) {
                return false;
            }
        }

        // 2. Enforce strict types
        if (typeof payload.normalizedSignal !== 'object') return false;
        if (typeof payload.originalSource !== 'string') return false;
        if (!Array.isArray(payload.signalSources)) return false;
        if (typeof payload.aiInputs !== 'string') return false;
        if (!Array.isArray(payload.agentOutputs)) return false;
        if (typeof payload.reasoning !== 'string') return false;
        if (typeof payload.confidence !== 'number') return false;
        if (typeof payload.consensus !== 'object') return false;
        if (typeof payload.metadata !== 'object') return false;
        if (typeof payload.modelVersion !== 'string') return false;
        if (typeof payload.timestamp !== 'string') return false;
        
        if (typeof payload.promptHash !== 'string' || payload.promptHash.length !== 64) return false;
        if (!Array.isArray(payload.agentIds)) return false;
        if (typeof payload.provider !== 'string') return false;
        if (typeof payload.cid !== 'string') return false;
        if (typeof payload.sha256Hash !== 'string' || payload.sha256Hash.length !== 64) return false;

        // Check metadata items
        if (typeof payload.metadata.protocolVersion !== 'string') return false;

        // Check consensus items
        if (typeof payload.consensus.weightedScore !== 'number') return false;
        if (typeof payload.consensus.weightedConfidence !== 'number') return false;
        if (typeof payload.consensus.approvalProbability !== 'number') return false;
        if (typeof payload.consensus.averagedReputation !== 'number') return false;

        return true;
    }
}
