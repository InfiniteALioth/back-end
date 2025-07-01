import { Request, Response } from 'express';
export declare class PageController {
    static createPage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getPages: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getPageById: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getPageByCode: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static updatePage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static deletePage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getMyPages: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export default PageController;
//# sourceMappingURL=pageController.d.ts.map