import { Request, Response } from 'express';
export declare class ChatController {
    static getMessages: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static sendMessage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static deleteMessage: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static getChatStats: (req: Request, res: Response, next: import("express").NextFunction) => void;
    static clearMessages: (req: Request, res: Response, next: import("express").NextFunction) => void;
}
export default ChatController;
//# sourceMappingURL=chatController.d.ts.map