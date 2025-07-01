import jwt from 'jsonwebtoken';
import { config } from '../config';
import { IJwtPayload, ITokens } from '../types';
import { AppError } from '../types';

export class JWTUtils {
  /**
   * 生成访问令牌
   */
  static generateAccessToken(payload: Omit<IJwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN,
    });
  }

  /**
   * 生成刷新令牌
   */
  static generateRefreshToken(payload: Omit<IJwtPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    });
  }

  /**
   * 生成令牌对
   */
  static generateTokens(payload: Omit<IJwtPayload, 'iat' | 'exp'>): ITokens {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 验证访问令牌
   */
  static verifyAccessToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET) as IJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('访问令牌已过期', 401);
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('无效的访问令牌', 401);
      } else {
        throw new AppError('令牌验证失败', 401);
      }
    }
  }

  /**
   * 验证刷新令牌
   */
  static verifyRefreshToken(token: string): IJwtPayload {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET) as IJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('刷新令牌已过期', 401);
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('无效的刷新令牌', 401);
      } else {
        throw new AppError('刷新令牌验证失败', 401);
      }
    }
  }

  /**
   * 从请求头中提取令牌
   */
  static extractTokenFromHeader(authHeader?: string): string {
    if (!authHeader) {
      throw new AppError('缺少授权头', 401);
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError('授权头格式错误', 401);
    }

    return parts[1];
  }

  /**
   * 解码令牌（不验证）
   */
  static decodeToken(token: string): IJwtPayload | null {
    try {
      return jwt.decode(token) as IJwtPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * 检查令牌是否即将过期（30分钟内）
   */
  static isTokenExpiringSoon(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - now;
    
    // 如果令牌在30分钟内过期，返回true
    return timeUntilExpiry < 30 * 60;
  }
}

export default JWTUtils;