import { Request, Response, NextFunction } from 'express';
export declare const errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
export declare const notFoundHandler: (req: Request, res: Response) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare const setupProcessHandlers: () => void;
declare const _default: {
    errorHandler: (error: Error, req: Request, res: Response, next: NextFunction) => void;
    notFoundHandler: (req: Request, res: Response) => void;
    asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
    setupProcessHandlers: () => void;
};
export default _default;
//# sourceMappingURL=errorHandler.d.ts.map