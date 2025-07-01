import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
export declare class SocketService {
    private io;
    private connectedUsers;
    private pageUsers;
    constructor(server: HTTPServer);
    private setupMiddleware;
    private setupEventHandlers;
    private handleJoinPage;
    private handleLeavePage;
    private handleSendMessage;
    private handleTyping;
    private handleDisconnect;
    getPageOnlineCount(pageId: string): number;
    getTotalOnlineCount(): number;
    sendSystemMessage(pageId: string, message: string): void;
    broadcastSystemNotification(notification: any): void;
    getIO(): SocketIOServer;
}
export default SocketService;
//# sourceMappingURL=socketService.d.ts.map