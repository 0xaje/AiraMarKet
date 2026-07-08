export interface IpfsUploadResult {
    cid: string;
    provider: string;
    latencyMs: number;
    timestamp: string;
    error?: string;
}

export interface IpfsProvider {
    name: string;
    isActive(): boolean;
    uploadJson(data: any): Promise<string>;
}
