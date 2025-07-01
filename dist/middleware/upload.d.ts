import multer from 'multer';
export declare const uploadSingle: (fieldName?: string) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadMultiple: (fieldName?: string, maxCount?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadFields: (fields: multer.Field[]) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const uploadAny: () => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const getFileType: (mimetype: string) => "image" | "video" | "audio" | "other";
export declare const generateFileName: (originalName: string) => string;
export declare const validateFileExtension: (filename: string, allowedExtensions: string[]) => boolean;
declare const _default: {
    uploadSingle: (fieldName?: string) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadMultiple: (fieldName?: string, maxCount?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadFields: (fields: multer.Field[]) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    uploadAny: () => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    getFileType: (mimetype: string) => "image" | "video" | "audio" | "other";
    generateFileName: (originalName: string) => string;
    validateFileExtension: (filename: string, allowedExtensions: string[]) => boolean;
};
export default _default;
//# sourceMappingURL=upload.d.ts.map