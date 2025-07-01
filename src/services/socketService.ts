import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { JWTUtils } from '../utils/jwt';
import { ChatMessage, MediaPage } from '../models';
import { IChatSocketData, ISocketUser, AppError } from '../types';
import logger from '../utils/logger';

export class SocketService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, ISocketUser> = new Map();
  private pageUsers: Map<string, Set<string>> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupMiddleware();
    this.setupEventHandlers();
  }

  /**
   * 设置中间件
   */
  private setupMiddleware(): void {
    // 认证中间件
    this.io.use(async (socket: Socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        
        if (!token) {
          // 允许匿名用户连接
          socket.data.user = {
            id: `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            username: `访客${Math.floor(Math.random() * 10000)}`,
            type: 'anonymous',
          };
          return next();
        }

        const decoded = JWTUtils.verifyAccessToken(token);
        socket.data.user = decoded;
        next();
      } catch (error) {
        logger.error('Socket 认证失败:', error);
        next(new Error('认证失败'));
      }
    });
  }

  /**
   * 设置事件处理器
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`用户连接: ${socket.data.user.username} (${socket.id})`);

      // 用户加入页面
      socket.on('join_page', async (data: { pageId: string; username?: string }) => {
        try {
          await this.handleJoinPage(socket, data);
        } catch (error) {
          logger.error('加入页面失败:', error);
          socket.emit('error', { message: '加入页面失败' });
        }
      });

      // 用户离开页面
      socket.on('leave_page', (data: { pageId: string }) => {
        this.handleLeavePage(socket, data.pageId);
      });

      // 发送聊天消息
      socket.on('send_message', async (data: IChatSocketData) => {
        try {
          await this.handleSendMessage(socket, data);
        } catch (error) {
          logger.error('发送消息失败:', error);
          socket.emit('error', { message: '发送消息失败' });
        }
      });

      // 用户正在输入
      socket.on('typing', (data: { pageId: string; isTyping: boolean }) => {
        this.handleTyping(socket, data);
      });

      // 用户断开连接
      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  /**
   * 处理用户加入页面
   */
  private async handleJoinPage(socket: Socket, data: { pageId: string; username?: string }): Promise<void> {
    const { pageId, username } = data;

    // 验证页面是否存在
    const page = await MediaPage.findOne({
      where: { id: pageId, isActive: true, isPublic: true }
    });

    if (!page) {
      throw new AppError('页面不存在或未公开', 404);
    }

    // 加入页面房间
    socket.join(pageId);

    // 更新用户信息
    const user: ISocketUser = {
      id: socket.data.user.id,
      username: username || socket.data.user.username,
      pageId,
    };

    this.connectedUsers.set(socket.id, user);

    // 更新页面用户列表
    if (!this.pageUsers.has(pageId)) {
      this.pageUsers.set(pageId, new Set());
    }
    this.pageUsers.get(pageId)!.add(socket.id);

    // 通知其他用户有新用户加入
    socket.to(pageId).emit('user_joined', {
      user: { id: user.id, username: user.username },
      onlineCount: this.pageUsers.get(pageId)!.size,
    });

    // 向当前用户发送在线用户列表
    const onlineUsers = Array.from(this.pageUsers.get(pageId)!).map(socketId => {
      const connectedUser = this.connectedUsers.get(socketId);
      return connectedUser ? { id: connectedUser.id, username: connectedUser.username } : null;
    }).filter(Boolean);

    socket.emit('joined_page', {
      pageId,
      onlineUsers,
      onlineCount: onlineUsers.length,
    });

    logger.info(`用户 ${user.username} 加入页面 ${pageId}`);
  }

  /**
   * 处理用户离开页面
   */
  private handleLeavePage(socket: Socket, pageId: string): void {
    socket.leave(pageId);

    const user = this.connectedUsers.get(socket.id);
    if (user && this.pageUsers.has(pageId)) {
      this.pageUsers.get(pageId)!.delete(socket.id);

      // 通知其他用户有用户离开
      socket.to(pageId).emit('user_left', {
        user: { id: user.id, username: user.username },
        onlineCount: this.pageUsers.get(pageId)!.size,
      });

      logger.info(`用户 ${user.username} 离开页面 ${pageId}`);
    }
  }

  /**
   * 处理发送消息
   */
  private async handleSendMessage(socket: Socket, data: IChatSocketData): Promise<void> {
    const { pageId, message, messageType = 'text' } = data;
    const user = this.connectedUsers.get(socket.id);

    if (!user) {
      throw new AppError('用户未连接到页面', 400);
    }

    // 验证消息内容
    if (!message || message.trim().length === 0) {
      throw new AppError('消息内容不能为空', 400);
    }

    if (message.length > 1000) {
      throw new AppError('消息内容过长', 400);
    }

    // 保存消息到数据库
    const chatMessage = await ChatMessage.create({
      pageId,
      userId: socket.data.user.type !== 'anonymous' ? socket.data.user.id : undefined,
      username: user.username,
      message: message.trim(),
      messageType,
    });

    // 构建消息数据
    const messageData = {
      id: chatMessage.id,
      pageId,
      userId: chatMessage.userId,
      username: chatMessage.username,
      message: chatMessage.message,
      messageType: chatMessage.messageType,
      createdAt: chatMessage.createdAt,
    };

    // 广播消息到页面内所有用户
    this.io.to(pageId).emit('new_message', messageData);

    logger.info(`用户 ${user.username} 在页面 ${pageId} 发送消息`);
  }

  /**
   * 处理用户正在输入
   */
  private handleTyping(socket: Socket, data: { pageId: string; isTyping: boolean }): void {
    const user = this.connectedUsers.get(socket.id);
    if (!user) return;

    socket.to(data.pageId).emit('user_typing', {
      user: { id: user.id, username: user.username },
      isTyping: data.isTyping,
    });
  }

  /**
   * 处理用户断开连接
   */
  private handleDisconnect(socket: Socket): void {
    const user = this.connectedUsers.get(socket.id);
    
    if (user) {
      // 从页面用户列表中移除
      if (this.pageUsers.has(user.pageId)) {
        this.pageUsers.get(user.pageId)!.delete(socket.id);

        // 通知其他用户
        socket.to(user.pageId).emit('user_left', {
          user: { id: user.id, username: user.username },
          onlineCount: this.pageUsers.get(user.pageId)!.size,
        });
      }

      // 从连接用户列表中移除
      this.connectedUsers.delete(socket.id);

      logger.info(`用户 ${user.username} 断开连接`);
    }
  }

  /**
   * 获取页面在线用户数
   */
  public getPageOnlineCount(pageId: string): number {
    return this.pageUsers.get(pageId)?.size || 0;
  }

  /**
   * 获取总在线用户数
   */
  public getTotalOnlineCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * 向特定页面发送系统消息
   */
  public sendSystemMessage(pageId: string, message: string): void {
    this.io.to(pageId).emit('system_message', {
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 向所有用户发送系统通知
   */
  public broadcastSystemNotification(notification: any): void {
    this.io.emit('system_notification', notification);
  }

  /**
   * 获取 Socket.IO 实例
   */
  public getIO(): SocketIOServer {
    return this.io;
  }
}

export default SocketService;