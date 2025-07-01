"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireOwnership = exports.optionalAuth = exports.requireUser = exports.requireSuperAdmin = exports.requireAdmin = exports.authenticate = void 0;
const types_1 = require("../types");
const jwt_1 = require("../utils/jwt");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = jwt_1.JWTUtils.extractTokenFromHeader(authHeader);
        const decoded = jwt_1.JWTUtils.verifyAccessToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.default.warn('认证失败:', error);
        if (error instanceof types_1.AppError) {
            response_1.ResponseUtils.unauthorized(res, error.message);
        }
        else {
            response_1.ResponseUtils.unauthorized(res, '认证失败');
        }
    }
};
exports.authenticate = authenticate;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return response_1.ResponseUtils.unauthorized(res, '请先登录');
    }
    if (req.user.type !== 'admin') {
        return response_1.ResponseUtils.forbidden(res, '需要管理员权限');
    }
    next();
};
exports.requireAdmin = requireAdmin;
const requireSuperAdmin = (req, res, next) => {
    if (!req.user) {
        return response_1.ResponseUtils.unauthorized(res, '请先登录');
    }
    if (req.user.type !== 'admin' || req.user.role !== 'super_admin') {
        return response_1.ResponseUtils.forbidden(res, '需要超级管理员权限');
    }
    next();
};
exports.requireSuperAdmin = requireSuperAdmin;
const requireUser = (req, res, next) => {
    if (!req.user) {
        return response_1.ResponseUtils.unauthorized(res, '请先登录');
    }
    if (req.user.type !== 'user') {
        return response_1.ResponseUtils.forbidden(res, '需要用户权限');
    }
    next();
};
exports.requireUser = requireUser;
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = jwt_1.JWTUtils.extractTokenFromHeader(authHeader);
            const decoded = jwt_1.JWTUtils.verifyAccessToken(token);
            req.user = decoded;
        }
    }
    catch (error) {
        logger_1.default.debug('可选认证失败:', error);
    }
    next();
};
exports.optionalAuth = optionalAuth;
const requireOwnership = (userIdField = 'userId') => {
    return (req, res, next) => {
        if (!req.user) {
            return response_1.ResponseUtils.unauthorized(res, '请先登录');
        }
        const resourceUserId = req.params[userIdField] || req.body[userIdField];
        if (req.user.type === 'admin') {
            return next();
        }
        if (req.user.id !== resourceUserId) {
            return response_1.ResponseUtils.forbidden(res, '只能访问自己的资源');
        }
        next();
    };
};
exports.requireOwnership = requireOwnership;
exports.default = {
    authenticate: exports.authenticate,
    requireAdmin: exports.requireAdmin,
    requireSuperAdmin: exports.requireSuperAdmin,
    requireUser: exports.requireUser,
    optionalAuth: exports.optionalAuth,
    requireOwnership: exports.requireOwnership,
};
//# sourceMappingURL=auth.js.map