import { Request, Response } from 'express';
export declare class AuthController {
    static register: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static login: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static adminLogin: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static refreshToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getCurrentUser: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static changePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static validateToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export default AuthController;
//# sourceMappingURL=authController.d.ts.map