"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
const jwt_1 = require("../utils/jwt");
const models_1 = require("../models");
const types_1 = require("../types");
const logger_1 = __importDefault(require("../utils/logger"));
class SocketService {
    constructor(server) {
        this.connectedUsers = new Map();
        this.pageUsers = new Map();
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
                methods: ['GET', 'POST'],
                credentials: true,
            },
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    setupMiddleware() {
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
                if (!token) {
                    socket.data.user = {
                        id: `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                        username: `访客${Math.floor(Math.random() * 10000)}`,
                        type: 'anonymous',
                    };
                    return next();
                }
                const decoded = jwt_1.JWTUtils.verifyAccessToken(token);
                socket.data.user = decoded;
                next();
            }
            catch (error) {
                logger_1.default.error('Socket 认证失败:', error);
                next(new Error('认证失败'));
            }
        });
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            logger_1.default.info(`用户连接: ${socket.data.user.username} (${socket.id})`);
            socket.on('join_page', async (data) => {
                try {
                    await this.handleJoinPage(socket, data);
                }
                catch (error) {
                    logger_1.default.error('加入页面失败:', error);
                    socket.emit('error', { message: '加入页面失败' });
                }
            });
            socket.on('leave_page', (data) => {
                this.handleLeavePage(socket, data.pageId);
            });
            socket.on('send_message', async (data) => {
                try {
                    await this.handleSendMessage(socket, data);
                }
                catch (error) {
                    logger_1.default.error('发送消息失败:', error);
                    socket.emit('error', { message: '发送消息失败' });
                }
            });
            socket.on('typing', (data) => {
                this.handleTyping(socket, data);
            });
            socket.on('disconnect', () => {
                this.handleDisconnect(socket);
            });
        });
    }
    async handleJoinPage(socket, data) {
        const { pageId, username } = data;
        const page = await models_1.MediaPage.findOne({
            where: { id: pageId, isActive: true, isPublic: true }
        });
        if (!page) {
            throw new types_1.AppError('页面不存在或未公开', 404);
        }
        socket.join(pageId);
        const user = {
            id: socket.data.user.id,
            username: username || socket.data.user.username,
            pageId,
        };
        this.connectedUsers.set(socket.id, user);
        if (!this.pageUsers.has(pageId)) {
            this.pageUsers.set(pageId, new Set());
        }
        this.pageUsers.get(pageId).add(socket.id);
        socket.to(pageId).emit('user_joined', {
            user: { id: user.id, username: user.username },
            onlineCount: this.pageUsers.get(pageId).size,
        });
        const onlineUsers = Array.from(this.pageUsers.get(pageId)).map(socketId => {
            const connectedUser = this.connectedUsers.get(socketId);
            return connectedUser ? { id: connectedUser.id, username: connectedUser.username } : null;
        }).filter(Boolean);
        socket.emit('joined_page', {
            pageId,
            onlineUsers,
            onlineCount: onlineUsers.length,
        });
        logger_1.default.info(`用户 ${user.username} 加入页面 ${pageId}`);
    }
    handleLeavePage(socket, pageId) {
        socket.leave(pageId);
        const user = this.connectedUsers.get(socket.id);
        if (user && this.pageUsers.has(pageId)) {
            this.pageUsers.get(pageId).delete(socket.id);
            socket.to(pageId).emit('user_left', {
                user: { id: user.id, username: user.username },
                onlineCount: this.pageUsers.get(pageId).size,
            });
            logger_1.default.info(`用户 ${user.username} 离开页面 ${pageId}`);
        }
    }
    async handleSendMessage(socket, data) {
        const { pageId, message, messageType = 'text' } = data;
        const user = this.connectedUsers.get(socket.id);
        if (!user) {
            throw new types_1.AppError('用户未连接到页面', 400);
        }
        if (!message || message.trim().length === 0) {
            throw new types_1.AppError('消息内容不能为空', 400);
        }
        if (message.length > 1000) {
            throw new types_1.AppError('消息内容过长', 400);
        }
        const chatMessage = await models_1.ChatMessage.create({
            pageId,
            userId: socket.data.user.type !== 'anonymous' ? socket.data.user.id : undefined,
            username: user.username,
            message: message.trim(),
            messageType,
        });
        const messageData = {
            id: chatMessage.id,
            pageId,
            userId: chatMessage.userId,
            username: chatMessage.username,
            message: chatMessage.message,
            messageType: chatMessage.messageType,
            createdAt: chatMessage.createdAt,
        };
        this.io.to(pageId).emit('new_message', messageData);
        logger_1.default.info(`用户 ${user.username} 在页面 ${pageId} 发送消息`);
    }
    handleTyping(socket, data) {
        const user = this.connectedUsers.get(socket.id);
        if (!user)
            return;
        socket.to(data.pageId).emit('user_typing', {
            user: { id: user.id, username: user.username },
            isTyping: data.isTyping,
        });
    }
    handleDisconnect(socket) {
        const user = this.connectedUsers.get(socket.id);
        if (user) {
            if (this.pageUsers.has(user.pageId)) {
                this.pageUsers.get(user.pageId).delete(socket.id);
                socket.to(user.pageId).emit('user_left', {
                    user: { id: user.id, username: user.username },
                    onlineCount: this.pageUsers.get(user.pageId).size,
                });
            }
            this.connectedUsers.delete(socket.id);
            logger_1.default.info(`用户 ${user.username} 断开连接`);
        }
    }
    getPageOnlineCount(pageId) {
        return this.pageUsers.get(pageId)?.size || 0;
    }
    getTotalOnlineCount() {
        return this.connectedUsers.size;
    }
    sendSystemMessage(pageId, message) {
        this.io.to(pageId).emit('system_message', {
            message,
            timestamp: new Date().toISOString(),
        });
    }
    broadcastSystemNotification(notification) {
        this.io.emit('system_notification', notification);
    }
    getIO() {
        return this.io;
    }
}
exports.SocketService = SocketService;
exports.default = SocketService;
//# sourceMappingURL=socketService.js.map