import { Request, Response } from 'express';
export declare class AdminController {
    static createAdmin: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getAdmins: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getUsers: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static updateUserStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static updateAdminStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getSystemStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getRecentActivity: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static healthCheck: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export default AdminController;
//# sourceMappingURL=adminController.d.ts.map