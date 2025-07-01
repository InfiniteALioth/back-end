export declare class OSSService {
    static initialize(): void;
    static getConfig(): any;
    static checkStatus(): Promise<boolean>;
    static getStorageStats(): Promise<any>;
    static cleanupExpiredFiles(days?: number): Promise<number>;
    static batchOperation(operation: 'delete' | 'copy' | 'move', files: string[], targetFolder?: string): Promise<void>;
}
export default OSSService;
//# sourceMappingURL=ossService.d.ts.map