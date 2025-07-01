import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
export declare const corsOptions: cors.CorsOptions;
export declare const createRateLimit: (windowMs?: number, max?: number) => import("express-rate-limit").RateLimitRequestHandler;
export declare const generalRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const uploadRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const compressionConfig: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const requestLogger: (req: Request, res: Response, next: NextFunction) => void;
export declare const healthCheck: (req: Request, res: Response) => void;
export declare const ipWhitelist: (allowedIPs: string[]) => (req: Request, res: Response, next: NextFunction) => void;
declare const _default: {
    corsOptions: cors.CorsOptions;
    createRateLimit: (windowMs?: number, max?: number) => import("express-rate-limit").RateLimitRequestHandler;
    generalRateLimit: import("express-rate-limit").RateLimitRequestHandler;
    authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
    uploadRateLimit: import("express-rate-limit").RateLimitRequestHandler;
    helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
    compressionConfig: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
    requestLogger: (req: Request, res: Response, next: NextFunction) => void;
    healthCheck: (req: Request, res: Response) => void;
    ipWhitelist: (allowedIPs: string[]) => (req: Request, res: Response, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=security.d.ts.map