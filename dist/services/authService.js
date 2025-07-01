"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = require("../utils/bcrypt");
const jwt_1 = require("../utils/jwt");
const models_1 = require("../models");
const types_1 = require("../types");
const logger_1 = __importDefault(require("../utils/logger"));
class AuthService {
    static async registerUser(userData) {
        try {
            const existingUser = await models_1.User.findOne({
                where: {
                    $or: [
                        { email: userData.email },
                        { username: userData.username }
                    ]
                }
            });
            if (existingUser) {
                throw new types_1.AppError('用户名或邮箱已存在', 409);
            }
            const hashedPassword = await bcrypt_1.BcryptUtils.hashPassword(userData.password);
            const user = await models_1.User.create({
                ...userData,
                password: hashedPassword,
            });
            const tokenPayload = {
                id: user.id,
                username: user.username,
                email: user.email,
                type: 'user',
            };
            const tokens = jwt_1.JWTUtils.generateTokens(tokenPayload);
            await user.update({ lastLoginAt: new Date() });
            const userResponse = user.toJSON();
            delete userResponse.password;
            logger_1.default.info(`用户注册成功: ${user.email}`);
            return { user: userResponse, tokens };
        }
        catch (error) {
            logger_1.default.error('用户注册失败:', error);
            throw error;
        }
    }
    static async loginUser(email, password) {
        try {
            const user = await models_1.User.findOne({ where: { email, isActive: true } });
            if (!user) {
                throw new types_1.AppError('用户不存在或已被禁用', 401);
            }
            const isPasswordValid = await bcrypt_1.BcryptUtils.comparePassword(password, user.password);
            if (!isPasswordValid) {
                throw new types_1.AppError('密码错误', 401);
            }
            const tokenPayload = {
                id: user.id,
                username: user.username,
                email: user.email,
                type: 'user',
            };
            const tokens = jwt_1.JWTUtils.generateTokens(tokenPayload);
            await user.update({ lastLoginAt: new Date() });
            const userResponse = user.toJSON();
            delete userResponse.password;
            logger_1.default.info(`用户登录成功: ${user.email}`);
            return { user: userResponse, tokens };
        }
        catch (error) {
            logger_1.default.error('用户登录失败:', error);
            throw error;
        }
    }
    static async loginAdmin(email, password) {
        try {
            const admin = await models_1.Admin.findOne({ where: { email, isActive: true } });
            if (!admin) {
                throw new types_1.AppError('管理员不存在或已被禁用', 401);
            }
            const isPasswordValid = await bcrypt_1.BcryptUtils.comparePassword(password, admin.password);
            if (!isPasswordValid) {
                throw new types_1.AppError('密码错误', 401);
            }
            const tokenPayload = {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                type: 'admin',
                role: admin.role,
            };
            const tokens = jwt_1.JWTUtils.generateTokens(tokenPayload);
            await admin.update({ lastLoginAt: new Date() });
            const adminResponse = admin.toJSON();
            delete adminResponse.password;
            logger_1.default.info(`管理员登录成功: ${admin.email}`);
            return { admin: adminResponse, tokens };
        }
        catch (error) {
            logger_1.default.error('管理员登录失败:', error);
            throw error;
        }
    }
    static async createAdmin(adminData) {
        try {
            const existingAdmin = await models_1.Admin.findOne({
                where: {
                    $or: [
                        { email: adminData.email },
                        { username: adminData.username }
                    ]
                }
            });
            if (existingAdmin) {
                throw new types_1.AppError('管理员用户名或邮箱已存在', 409);
            }
            const hashedPassword = await bcrypt_1.BcryptUtils.hashPassword(adminData.password);
            const admin = await models_1.Admin.create({
                ...adminData,
                password: hashedPassword,
            });
            const adminResponse = admin.toJSON();
            delete adminResponse.password;
            logger_1.default.info(`管理员创建成功: ${admin.email}`);
            return adminResponse;
        }
        catch (error) {
            logger_1.default.error('管理员创建失败:', error);
            throw error;
        }
    }
    static async refreshTokens(refreshToken) {
        try {
            const decoded = jwt_1.JWTUtils.verifyRefreshToken(refreshToken);
            let user;
            if (decoded.type === 'user') {
                user = await models_1.User.findByPk(decoded.id);
            }
            else if (decoded.type === 'admin') {
                user = await models_1.Admin.findByPk(decoded.id);
            }
            if (!user || !user.isActive) {
                throw new types_1.AppError('用户不存在或已被禁用', 401);
            }
            const tokenPayload = {
                id: user.id,
                username: user.username,
                email: user.email,
                type: decoded.type,
                role: decoded.role,
            };
            const tokens = jwt_1.JWTUtils.generateTokens(tokenPayload);
            logger_1.default.info(`令牌刷新成功: ${user.email}`);
            return tokens;
        }
        catch (error) {
            logger_1.default.error('令牌刷新失败:', error);
            throw error;
        }
    }
    static async validateUser(userId, userType) {
        try {
            let user;
            if (userType === 'user') {
                user = await models_1.User.findByPk(userId);
            }
            else {
                user = await models_1.Admin.findByPk(userId);
            }
            if (!user || !user.isActive) {
                throw new types_1.AppError('用户不存在或已被禁用', 401);
            }
            return user;
        }
        catch (error) {
            logger_1.default.error('用户验证失败:', error);
            throw error;
        }
    }
    static async changePassword(userId, userType, oldPassword, newPassword) {
        try {
            const user = await this.validateUser(userId, userType);
            const isOldPasswordValid = await bcrypt_1.BcryptUtils.comparePassword(oldPassword, user.password);
            if (!isOldPasswordValid) {
                throw new types_1.AppError('原密码错误', 400);
            }
            const hashedNewPassword = await bcrypt_1.BcryptUtils.hashPassword(newPassword);
            await user.update({ password: hashedNewPassword });
            logger_1.default.info(`密码修改成功: ${user.email}`);
        }
        catch (error) {
            logger_1.default.error('密码修改失败:', error);
            throw error;
        }
    }
}
exports.AuthService = AuthService;
exports.default = AuthService;
//# sourceMappingURL=authService.js.map