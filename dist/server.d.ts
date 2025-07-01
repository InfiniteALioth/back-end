import express from 'express';
import { SocketService } from './services/socketService';
declare class Server {
    private app;
    private server;
    private socketService;
    constructor();
    private setupMiddleware;
    private setupRoutes;
    private setupErrorHandling;
    private initializeServices;
    start(): Promise<void>;
    private setupGracefulShutdown;
    getApp(): express.Application;
    getSocketService(): SocketService;
}
declare const server: Server;
export default server;
export { Server };
//# sourceMappingURL=server.d.ts.map