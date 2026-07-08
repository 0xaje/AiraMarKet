import crypto from 'crypto';

export class EvidenceSerializer {
    /**
     * Deterministically serializes any object by sorting keys alphabetically
     */
    static serialize(obj: any): string {
        if (obj === null || obj === undefined) {
            return '';
        }
        if (typeof obj !== 'object') {
            return JSON.stringify(obj);
        }
        if (Array.isArray(obj)) {
            return JSON.stringify(obj.map(item => this.serializeToObj(item)));
        }
        return JSON.stringify(this.serializeToObj(obj));
    }

    private static serializeToObj(obj: any): any {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.serializeToObj(item));
        }
        const sortedObj: any = {};
        Object.keys(obj).sort().forEach(key => {
            sortedObj[key] = this.serializeToObj(obj[key]);
        });
        return sortedObj;
    }

    /**
     * Generates a SHA-256 hash of the serialized string
     */
    static generateHash(serialized: string): string {
        return crypto.createHash('sha256').update(serialized).digest('hex');
    }
}
