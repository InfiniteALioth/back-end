import { IOSSUploadResult } from '../types';
export declare class OSSUtils {
    private static client;
    static initialize(): void;
    static uploadFile(file: Buffer | string, originalName: string, folder?: string): Promise<IOSSUploadResult>;
    static uploadMultipleFiles(files: Array<{
        buffer: Buffer;
        originalName: string;
    }>, folder?: string): Promise<IOSSUploadResult[]>;
    static deleteFile(objectName: string): Promise<void>;
    static deleteMultipleFiles(objectNames: string[]): Promise<void>;
    static getSignedUrl(objectName: string, expires?: number): Promise<string>;
    static fileExists(objectName: string): Promise<boolean>;
    static getFileInfo(objectName: string): Promise<any>;
}
export default OSSUtils;
//# sourceMappingURL=oss.d.ts.map