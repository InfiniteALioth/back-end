"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const database_1 = require("./config/database");
const ossService_1 = require("./services/ossService");
const socketService_1 = require("./services/socketService");
const security_1 = require("./middleware/security");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = __importDefault(require("./utils/logger"));
const auth_1 = __importDefault(require("./routes/auth"));
const pages_1 = __importDefault(require("./routes/pages"));
const media_1 = __importDefault(require("./routes/media"));
const chat_1 = __importDefault(require("./routes/chat"));
const admin_1 = __importDefault(require("./routes/admin"));
const upload_1 = __importDefault(require("./routes/upload"));
const users_1 = __importDefault(require("./routes/users"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        this.socketService = new socketService_1.SocketService(this.server);
        this.setupMiddleware();
        this.setupRoutes();
        this.setupErrorHandling();
    }
    setupMiddleware() {
        this.app.use(security_1.helmetConfig);
        this.app.use((0, cors_1.default)(security_1.corsOptions));
        this.app.use(security_1.compressionConfig);
        this.app.use(security_1.generalRateLimit);
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        this.app.use(security_1.requestLogger);
        this.app.get('/health', security_1.healthCheck);
    }
    setupRoutes() {
        const apiPrefix = `/api/${config_1.config.API_VERSION}`;
        this.app.use(`${apiPrefix}/auth`, auth_1.default);
        this.app.use(`${apiPrefix}/pages`, pages_1.default);
        this.app.use(`${apiPrefix}/media`, media_1.default);
        this.app.use(`${apiPrefix}/chat`, chat_1.default);
        this.app.use(`${apiPrefix}/admin`, admin_1.default);
        this.app.use(`${apiPrefix}/upload`, upload_1.default);
        this.app.use(`${apiPrefix}/users`, users_1.default);
        this.app.get(`${apiPrefix}`, (req, res) => {
            res.json({
                success: true,
                message: 'Interactive Media Platform API',
                version: config_1.config.API_VERSION,
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
        this.app.get('/', (req, res) => {
            res.json({
                success: true,
                message: 'Interactive Media Platform Backend',
                version: config_1.config.API_VERSION,
                timestamp: new Date().toISOString(),
                api: `${apiPrefix}`,
            });
        });
    }
    setupErrorHandling() {
        this.app.use(errorHandler_1.notFoundHandler);
        this.app.use(errorHandler_1.errorHandler);
        (0, errorHandler_1.setupProcessHandlers)();
    }
    async initializeServices() {
        try {
            await (0, database_1.connectDatabase)();
            logger_1.default.info('数据库连接成功');
            ossService_1.OSSService.initialize();
            logger_1.default.info('OSS 服务初始化成功');
            logger_1.default.info('所有服务初始化完成');
        }
        catch (error) {
            logger_1.default.error('服务初始化失败:', error);
            process.exit(1);
        }
    }
    async start() {
        try {
            await this.initializeServices();
            this.server.listen(config_1.config.PORT, () => {
                logger_1.default.info(`服务器启动成功`);
                logger_1.default.info(`环境: ${config_1.config.NODE_ENV}`);
                logger_1.default.info(`端口: ${config_1.config.PORT}`);
                logger_1.default.info(`API版本: ${config_1.config.API_VERSION}`);
                logger_1.default.info(`API地址: http://localhost:${config_1.config.PORT}/api/${config_1.config.API_VERSION}`);
                if (config_1.config.NODE_ENV === 'development') {
                    logger_1.default.info('开发模式已启用');
                    logger_1.default.info(`健康检查: http://localhost:${config_1.config.PORT}/health`);
                }
            });
            this.setupGracefulShutdown();
        }
        catch (error) {
            logger_1.default.error('服务器启动失败:', error);
            process.exit(1);
        }
    }
    setupGracefulShutdown() {
        const shutdown = (signal) => {
            logger_1.default.info(`收到 ${signal} 信号，开始优雅关闭...`);
            this.server.close(() => {
                logger_1.default.info('HTTP 服务器已关闭');
                logger_1.default.info('优雅关闭完成');
                process.exit(0);
            });
            setTimeout(() => {
                logger_1.default.error('强制关闭服务器');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    getApp() {
        return this.app;
    }
    getSocketService() {
        return this.socketService;
    }
}
exports.Server = Server;
const server = new Server();
if (require.main === module) {
    server.start().catch((error) => {
        logger_1.default.error('服务器启动失败:', error);
        process.exit(1);
    });
}
exports.default = server;
//# sourceMappingURL=server.js.map