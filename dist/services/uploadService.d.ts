export declare class UploadService {
    static uploadSingleFile(file: Express.Multer.File, folder?: string): Promise<{
        url: string;
        filename: string;
        size: number;
        type: string;
    }>;
    static uploadMultipleFiles(files: Express.Multer.File[], folder?: string): Promise<Array<{
        url: string;
        filename: string;
        size: number;
        type: string;
    }>>;
    static deleteFile(filename: string): Promise<void>;
    static deleteMultipleFiles(filenames: string[]): Promise<void>;
    static getSignedUrl(filename: string, expires?: number): Promise<string>;
    static validateFileType(file: Express.Multer.File, allowedTypes: string[]): boolean;
    static validateFileSize(file: Express.Multer.File, maxSize: number): boolean;
    static getFileInfo(filename: string): Promise<any>;
    static fileExists(filename: string): Promise<boolean>;
    static uploadAvatar(file: Express.Multer.File, userId: string): Promise<string>;
    static uploadMediaFile(file: Express.Multer.File, pageId: string): Promise<{
        url: string;
        thumbnailUrl?: string;
        duration?: number;
    }>;
}
export default UploadService;
//# sourceMappingURL=uploadService.d.ts.map