import { Request, Response, NextFunction } from 'express';
import { IAuthRequest, AppError } from '../types';
import { JWTUtils } from '../utils/jwt';
import { ResponseUtils } from '../utils/response';
import logger from '../utils/logger';

/**
 * JWT 认证中间件
 */
export const authenticate = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = JWTUtils.extractTokenFromHeader(authHeader);
    const decoded = JWTUtils.verifyAccessToken(token);
    
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('认证失败:', error);
    if (error instanceof AppError) {
      ResponseUtils.unauthorized(res, error.message);
    } else {
      ResponseUtils.unauthorized(res, '认证失败');
    }
  }
};

/**
 * 管理员权限验证中间件
 */
export const requireAdmin = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return ResponseUtils.unauthorized(res, '请先登录');
  }

  if (req.user.type !== 'admin') {
    return ResponseUtils.forbidden(res, '需要管理员权限');
  }

  next();
};

/**
 * 超级管理员权限验证中间件
 */
export const requireSuperAdmin = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return ResponseUtils.unauthorized(res, '请先登录');
  }

  if (req.user.type !== 'admin' || req.user.role !== 'super_admin') {
    return ResponseUtils.forbidden(res, '需要超级管理员权限');
  }

  next();
};

/**
 * 用户权限验证中间件
 */
export const requireUser = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    return ResponseUtils.unauthorized(res, '请先登录');
  }

  if (req.user.type !== 'user') {
    return ResponseUtils.forbidden(res, '需要用户权限');
  }

  next();
};

/**
 * 可选认证中间件（不强制要求认证）
 */
export const optionalAuth = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = JWTUtils.extractTokenFromHeader(authHeader);
      const decoded = JWTUtils.verifyAccessToken(token);
      req.user = decoded;
    }
  } catch (error) {
    // 可选认证失败时不阻止请求继续
    logger.debug('可选认证失败:', error);
  }
  
  next();
};

/**
 * 检查用户是否为资源所有者
 */
export const requireOwnership = (userIdField: string = 'userId') => {
  return (req: IAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return ResponseUtils.unauthorized(res, '请先登录');
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    if (req.user.type === 'admin') {
      // 管理员可以访问所有资源
      return next();
    }

    if (req.user.id !== resourceUserId) {
      return ResponseUtils.forbidden(res, '只能访问自己的资源');
    }

    next();
  };
};

export default {
  authenticate,
  requireAdmin,
  requireSuperAdmin,
  requireUser,
  optionalAuth,
  requireOwnership,
};