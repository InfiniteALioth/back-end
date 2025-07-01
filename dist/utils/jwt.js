"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTUtils = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const types_1 = require("../types");
class JWTUtils {
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.config.JWT_SECRET, {
            expiresIn: config_1.config.JWT_EXPIRES_IN,
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, config_1.config.JWT_REFRESH_SECRET, {
            expiresIn: config_1.config.JWT_REFRESH_EXPIRES_IN,
        });
    }
    static generateTokens(payload) {
        const accessToken = this.generateAccessToken(payload);
        const refreshToken = this.generateRefreshToken(payload);
        return {
            accessToken,
            refreshToken,
        };
    }
    static verifyAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.config.JWT_SECRET);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new types_1.AppError('访问令牌已过期', 401);
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new types_1.AppError('无效的访问令牌', 401);
            }
            else {
                throw new types_1.AppError('令牌验证失败', 401);
            }
        }
    }
    static verifyRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.config.JWT_REFRESH_SECRET);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new types_1.AppError('刷新令牌已过期', 401);
            }
            else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new types_1.AppError('无效的刷新令牌', 401);
            }
            else {
                throw new types_1.AppError('刷新令牌验证失败', 401);
            }
        }
    }
    static extractTokenFromHeader(authHeader) {
        if (!authHeader) {
            throw new types_1.AppError('缺少授权头', 401);
        }
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new types_1.AppError('授权头格式错误', 401);
        }
        return parts[1];
    }
    static decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            return null;
        }
    }
    static isTokenExpiringSoon(token) {
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.exp - now;
        return timeUntilExpiry < 30 * 60;
    }
}
exports.JWTUtils = JWTUtils;
exports.default = JWTUtils;
//# sourceMappingURL=jwt.js.map