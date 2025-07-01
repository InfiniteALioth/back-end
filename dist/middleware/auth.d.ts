import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../types';
export declare const authenticate: (req: IAuthRequest, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: IAuthRequest, res: Response, next: NextFunction) => void;
export declare const requireSuperAdmin: (req: IAuthRequest, res: Response, next: NextFunction) => void;
export declare const requireUser: (req: IAuthRequest, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: IAuthRequest, res: Response, next: NextFunction) => void;
export declare const requireOwnership: (userIdField?: string) => (req: IAuthRequest, res: Response, next: NextFunction) => void;
declare const _default: {
    authenticate: (req: IAuthRequest, res: Response, next: NextFunction) => void;
    requireAdmin: (req: IAuthRequest, res: Response, next: NextFunction) => void;
    requireSuperAdmin: (req: IAuthRequest, res: Response, next: NextFunction) => void;
    requireUser: (req: IAuthRequest, res: Response, next: NextFunction) => void;
    optionalAuth: (req: IAuthRequest, res: Response, next: NextFunction) => void;
    requireOwnership: (userIdField?: string) => (req: IAuthRequest, res: Response, next: NextFunction) => void;
};
export default _default;
//# sourceMappingURL=auth.d.ts.map