import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';
import logger from '../utils/logger';
import { ResponseUtils } from '../utils/response';

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = '服务器内部错误';
  let errorDetails: string | undefined;

  // 记录错误日志
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // 处理自定义应用错误
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }
  // 处理 Sequelize 错误
  else if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = '数据验证失败';
    errorDetails = (error as any).errors?.map((e: any) => e.message).join(', ');
  }
  else if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = '数据已存在';
    errorDetails = (error as any).errors?.map((e: any) => `${e.path}: ${e.value}`).join(', ');
  }
  else if (error.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = '关联数据不存在';
  }
  else if (error.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    message = '数据库操作失败';
  }
  // 处理 JWT 错误
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = '无效的令牌';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = '令牌已过期';
  }
  // 处理 Multer 错误
  else if (error.name === 'MulterError') {
    statusCode = 400;
    const multerError = error as any;
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
  // 处理语法错误
  else if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = '请求数据格式错误';
  }
  // 处理其他已知错误
  else if (error.message.includes('CORS')) {
    statusCode = 403;
    message = 'CORS 策略阻止了此请求';
  }

  // 在开发环境中包含错误堆栈
  if (process.env.NODE_ENV === 'development') {
    errorDetails = error.stack;
  }

  // 发送错误响应
  ResponseUtils.error(res, message, statusCode, errorDetails);
};

/**
 * 404 错误处理中间件
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseUtils.notFound(res, `路由 ${req.method} ${req.url} 不存在`);
};

/**
 * 异步错误捕获包装器
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 进程异常处理
 */
export const setupProcessHandlers = (): void => {
  // 处理未捕获的异常
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    process.exit(1);
  });

  // 处理未处理的 Promise 拒绝
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
  });

  // 处理进程终止信号
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
  });
};

export default {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  setupProcessHandlers,
};