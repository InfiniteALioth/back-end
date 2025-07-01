import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { config } from '../config';

// CORS 配置
export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = config.CORS_ORIGIN.split(',').map(o => o.trim());
    
    // 允许没有 origin 的请求（如移动应用）
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('不允许的 CORS 来源'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
};

// 速率限制配置
export const createRateLimit = (windowMs: number = 15 * 60 * 1000, max: number = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: '请求过于频繁，请稍后再试',
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // 跳过健康检查和静态资源
      return req.path === '/health' || req.path.startsWith('/static');
    },
  });
};

// 通用速率限制
export const generalRateLimit = createRateLimit(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15分钟
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10)  // 100次请求
);

// 认证相关的严格速率限制
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15分钟
  5               // 5次尝试
);

// 上传文件的速率限制
export const uploadRateLimit = createRateLimit(
  60 * 1000,      // 1分钟
  10              // 10次上传
);

// Helmet 安全配置
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "https:"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// 压缩配置
export const compressionConfig = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
  threshold: 1024,
});

// 请求日志中间件
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };
    
    if (res.statusCode >= 400) {
      console.error('HTTP Error:', logData);
    } else {
      console.log('HTTP Request:', logData);
    }
  });
  
  next();
};

// 健康检查中间件
export const healthCheck = (req: Request, res: Response): void => {
  try {
    res.status(200).json({
      success: true,
      message: '服务运行正常',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误',
      timestamp: new Date().toISOString(),
    });
  }
};

// IP 白名单中间件（可选）
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.length === 0 || allowedIPs.includes(clientIP || '')) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: 'IP 地址不在白名单中',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

export default {
  corsOptions,
  createRateLimit,
  generalRateLimit,
  authRateLimit,
  uploadRateLimit,
  helmetConfig,
  compressionConfig,
  requestLogger,
  healthCheck,
  ipWhitelist,
};