export class EvidenceValidator {
    /**
     * Validates if the object structure meets all protocol Evidence Package requirements
     */
    static validate(payload: any): boolean {
        if (!payload) return false;
        
        const requiredFields = [
            'normalizedSignal',
            'originalSource',
            'agentOutputs',
            'reasoning',
            'confidence',
            'metadata',
            'modelVersion',
            'timestamp'
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
        if (!Array.isArray(payload.agentOutputs)) return false;
        if (typeof payload.reasoning !== 'string') return false;
        if (typeof payload.confidence !== 'number') return false;
        if (typeof payload.metadata !== 'object') return false;
        if (typeof payload.modelVersion !== 'string') return false;
        if (typeof payload.timestamp !== 'string') return false;

        return true;
    }
}
