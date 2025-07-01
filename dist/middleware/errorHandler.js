"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupProcessHandlers = exports.asyncHandler = exports.notFoundHandler = exports.errorHandler = void 0;
const types_1 = require("../types");
const logger_1 = __importDefault(require("../utils/logger"));
const response_1 = require("../utils/response");
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = '服务器内部错误';
    let errorDetails;
    logger_1.default.error('Error occurred:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
    });
    if (error instanceof types_1.AppError) {
        statusCode = error.statusCode;
        message = error.message;
    }
    else if (error.name === 'SequelizeValidationError') {
        statusCode = 400;
        message = '数据验证失败';
        errorDetails = error.errors?.map((e) => e.message).join(', ');
    }
    else if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = '数据已存在';
        errorDetails = error.errors?.map((e) => `${e.path}: ${e.value}`).join(', ');
    }
    else if (error.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = '关联数据不存在';
    }
    else if (error.name === 'SequelizeDatabaseError') {
        statusCode = 500;
        message = '数据库操作失败';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = '无效的令牌';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = '令牌已过期';
    }
    else if (error.name === 'MulterError') {
        statusCode = 400;
        const multerError = error;
        switch (multerError.code) {
            case 'LIMIT_FILE_SIZE':
                message = '文件大小超出限制';
                break;
            case 'LIMIT_FILE_COUNT':
                message = '文件数量超出限制';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = '意外的文件字段';
                break;
            default:
                message = '文件上传失败';
        }
    }
    else if (error instanceof SyntaxError && 'body' in error) {
        statusCode = 400;
        message = '请求数据格式错误';
    }
    else if (error.message.includes('CORS')) {
        statusCode = 403;
        message = 'CORS 策略阻止了此请求';
    }
    if (process.env.NODE_ENV === 'development') {
        errorDetails = error.stack;
    }
    response_1.ResponseUtils.error(res, message, statusCode, errorDetails);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    response_1.ResponseUtils.notFound(res, `路由 ${req.method} ${req.url} 不存在`);
};
exports.notFoundHandler = notFoundHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const setupProcessHandlers = () => {
    process.on('uncaughtException', (error) => {
        logger_1.default.error('Uncaught Exception:', error);
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
    process.on('SIGTERM', () => {
        logger_1.default.info('SIGTERM received, shutting down gracefully');
        process.exit(0);
    });
    process.on('SIGINT', () => {
        logger_1.default.info('SIGINT received, shutting down gracefully');
        process.exit(0);
    });
};
exports.setupProcessHandlers = setupProcessHandlers;
exports.default = {
    errorHandler: exports.errorHandler,
    notFoundHandler: exports.notFoundHandler,
    asyncHandler: exports.asyncHandler,
    setupProcessHandlers: exports.setupProcessHandlers,
};
//# sourceMappingURL=errorHandler.js.map