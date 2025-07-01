import { Request, Response } from 'express';
export declare class UploadController {
    static uploadSingle: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static uploadMultiple: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static uploadAvatar: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static uploadMedia: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static deleteFile: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static deleteMultipleFiles: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getSignedUrl: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getFileInfo: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static checkFileExists: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export default UploadController;
//# sourceMappingURL=uploadController.d.ts.map