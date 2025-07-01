import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { config } from './config';
import { connectDatabase } from './config/database';
import { OSSService } from './services/ossService';
import { SocketService } from './services/socketService';
import {
  corsOptions,
  helmetConfig,
  compressionConfig,
  generalRateLimit,
  requestLogger,
  healthCheck,
} from './middleware/security';
import {
  errorHandler,
  notFoundHandler,
  setupProcessHandlers,
} from './middleware/errorHandler';
import logger from './utils/logger';

// 导入路由
import authRoutes from './routes/auth';
import pageRoutes from './routes/pages';
import mediaRoutes from './routes/media';
import chatRoutes from './routes/chat';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';
import userRoutes from './routes/users';

class Server {
  private app: express.Application;
  private server: any;
  private socketService: SocketService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.socketService = new SocketService(this.server);
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * 设置中间件
   */
  private setupMiddleware(): void {
    // 安全中间件
    this.app.use(helmetConfig);
    this.app.use(cors(corsOptions));
    this.app.use(compressionConfig);

    // 速率限制
    this.app.use(generalRateLimit);

    // 请求解析
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // 请求日志
    this.app.use(requestLogger);

    // 健康检查
    this.app.get('/health', healthCheck);
  }

  /**
   * 设置路由
   */
  private setupRoutes(): void {
    const apiPrefix = `/api/${config.API_VERSION}`;

    // API 路由
    this.app.use(`${apiPrefix}/auth`, authRoutes);
    this.app.use(`${apiPrefix}/pages`, pageRoutes);
    this.app.use(`${apiPrefix}/media`, mediaRoutes);
    this.app.use(`${apiPrefix}/chat`, chatRoutes);
    this.app.use(`${apiPrefix}/admin`, adminRoutes);
    this.app.use(`${apiPrefix}/upload`, uploadRoutes);
    this.app.use(`${apiPrefix}/users`, userRoutes);

    // API 根路径
    this.app.get(`${apiPrefix}`, (req, res) => {
      res.json({
        success: true,
        message: 'Interactive Media Platform API',
        version: config.API_VERSION,
        timestamp: new Date().toISOString(),
        endpoints: {
          auth: `${apiPrefix}/auth`,
          pages: `${apiPrefix}/pages`,
          media: `${apiPrefix}/media`,
          chat: `${apiPrefix}/chat`,
          admin: `${apiPrefix}/admin`,
          upload: `${apiPrefix}/upload`,
          users: `${apiPrefix}/users`,
        },
      });
    });

    // 根路径
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Interactive Media Platform Backend',
        version: config.API_VERSION,
        timestamp: new Date().toISOString(),
        api: `${apiPrefix}`,
      });
    });
  }

  /**
   * 设置错误处理
   */
  private setupErrorHandling(): void {
    // 404 处理
    this.app.use(notFoundHandler);

    // 全局错误处理
    this.app.use(errorHandler);

    // 进程异常处理
    setupProcessHandlers();
  }

  /**
   * 初始化服务
   */
  private async initializeServices(): Promise<void> {
    try {
      // 连接数据库
      await connectDatabase();
      logger.info('数据库连接成功');

      // 初始化 OSS 服务
      OSSService.initialize();
      logger.info('OSS 服务初始化成功');

      logger.info('所有服务初始化完成');
    } catch (error) {
      logger.error('服务初始化失败:', error);
      process.exit(1);
    }
  }

  /**
   * 启动服务器
   */
  public async start(): Promise<void> {
    try {
      // 初始化服务
      await this.initializeServices();

      // 启动服务器
      this.server.listen(config.PORT, () => {
        logger.info(`服务器启动成功`);
        logger.info(`环境: ${config.NODE_ENV}`);
        logger.info(`端口: ${config.PORT}`);
        logger.info(`API版本: ${config.API_VERSION}`);
        logger.info(`API地址: http://localhost:${config.PORT}/api/${config.API_VERSION}`);
        
        if (config.NODE_ENV === 'development') {
          logger.info('开发模式已启用');
          logger.info(`健康检查: http://localhost:${config.PORT}/health`);
        }
      });

      // 优雅关闭处理
      this.setupGracefulShutdown();

    } catch (error) {
      logger.error('服务器启动失败:', error);
      process.exit(1);
    }
  }

  /**
   * 设置优雅关闭
   */
  private setupGracefulShutdown(): void {
    const shutdown = (signal: string) => {
      logger.info(`收到 ${signal} 信号，开始优雅关闭...`);
      
      this.server.close(() => {
        logger.info('HTTP 服务器已关闭');
        
        // 关闭数据库连接
        // sequelize.close();
        
        logger.info('优雅关闭完成');
        process.exit(0);
      });

      // 强制关闭超时
      setTimeout(() => {
        logger.error('强制关闭服务器');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  }

  /**
   * 获取 Express 应用实例
   */
  public getApp(): express.Application {
    return this.app;
  }

  /**
   * 获取 Socket 服务实例
   */
  public getSocketService(): SocketService {
    return this.socketService;
  }
}

// 创建并启动服务器
const server = new Server();

// 如果直接运行此文件，启动服务器
if (require.main === module) {
  server.start().catch((error) => {
    logger.error('服务器启动失败:', error);
    process.exit(1);
  });
}

export default server;
export { Server };