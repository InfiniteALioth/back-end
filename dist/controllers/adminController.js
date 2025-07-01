"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const models_1 = require("../models");
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
const types_1 = require("../types");
const errorHandler_1 = require("../middleware/errorHandler");
const sequelize_1 = require("sequelize");
class AdminController {
}
exports.AdminController = AdminController;
_a = AdminController;
AdminController.createAdmin = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { username, email, password, role } = req.body;
    const admin = await authService_1.AuthService.createAdmin({
        username,
        email,
        password,
        role,
    });
    response_1.ResponseUtils.created(res, admin, '管理员创建成功');
});
AdminController.getAdmins = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search, role, } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause = {};
    if (search) {
        whereClause[sequelize_1.Op.or] = [
            { username: { [sequelize_1.Op.like]: `%${search}%` } },
            { email: { [sequelize_1.Op.like]: `%${search}%` } }
        ];
    }
    if (role) {
        whereClause.role = role;
    }
    const { count, rows } = await models_1.Admin.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [[sortBy, sortOrder]],
        limit: Number(limit),
        offset,
    });
    const totalPages = Math.ceil(count / Number(limit));
    const result = {
        items: rows,
        pagination: {
            currentPage: Number(page),
            totalPages,
            totalItems: count,
            itemsPerPage: Number(limit),
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
        },
    };
    response_1.ResponseUtils.paginated(res, result, '获取管理员列表成功');
});
AdminController.getUsers = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search, isActive, } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause = {};
    if (search) {
        whereClause[sequelize_1.Op.or] = [
            { username: { [sequelize_1.Op.like]: `%${search}%` } },
            { email: { [sequelize_1.Op.like]: `%${search}%` } }
        ];
    }
    if (typeof isActive === 'string') {
        whereClause.isActive = isActive === 'true';
    }
    const { count, rows } = await models_1.User.findAndCountAll({
        where: whereClause,
        attributes: { exclude: ['password'] },
        order: [[sortBy, sortOrder]],
        limit: Number(limit),
        offset,
    });
    const totalPages = Math.ceil(count / Number(limit));
    const result = {
        items: rows,
        pagination: {
            currentPage: Number(page),
            totalPages,
            totalItems: count,
            itemsPerPage: Number(limit),
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
        },
    };
    response_1.ResponseUtils.paginated(res, result, '获取用户列表成功');
});
AdminController.updateUserStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = await models_1.User.findByPk(id);
    if (!user) {
        throw new types_1.AppError('用户不存在', 404);
    }
    await user.update({ isActive });
    response_1.ResponseUtils.success(res, null, '用户状态更新成功');
});
AdminController.updateAdminStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
    if (id === req.user.id) {
        throw new types_1.AppError('不能禁用自己的账户', 400);
    }
    const admin = await models_1.Admin.findByPk(id);
    if (!admin) {
        throw new types_1.AppError('管理员不存在', 404);
    }
    await admin.update({ isActive });
    response_1.ResponseUtils.success(res, null, '管理员状态更新成功');
});
AdminController.getSystemStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [totalUsers, totalAdmins, totalPages, totalMediaItems, totalChatMessages, activePages, todayRegistrations, todayPageViews, todayMessages,] = await Promise.all([
        models_1.User.count({ where: { isActive: true } }),
        models_1.Admin.count({ where: { isActive: true } }),
        models_1.MediaPage.count({ where: { isActive: true } }),
        models_1.MediaItem.count({ where: { isActive: true } }),
        models_1.ChatMessage.count({ where: { isDeleted: false } }),
        models_1.MediaPage.count({ where: { isActive: true, isPublic: true } }),
        models_1.User.count({
            where: {
                createdAt: { [sequelize_1.Op.gte]: today }
            }
        }),
        models_1.MediaPage.sum('viewCount') || 0,
        models_1.ChatMessage.count({
            where: {
                isDeleted: false,
                createdAt: { [sequelize_1.Op.gte]: today }
            }
        }),
    ]);
    const stats = {
        users: {
            total: totalUsers,
            todayRegistrations,
        },
        admins: {
            total: totalAdmins,
        },
        pages: {
            total: totalPages,
            active: activePages,
            totalViews: todayPageViews,
        },
        media: {
            totalItems: totalMediaItems,
        },
        chat: {
            totalMessages: totalChatMessages,
            todayMessages,
        },
        system: {
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            nodeVersion: process.version,
        },
    };
    response_1.ResponseUtils.success(res, stats, '获取系统统计成功');
});
AdminController.getRecentActivity = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { limit = 20 } = req.query;
    const recentUsers = await models_1.User.findAll({
        attributes: ['id', 'username', 'email', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: Number(limit) / 4,
    });
    const recentPages = await models_1.MediaPage.findAll({
        attributes: ['id', 'title', 'internalCode', 'createdAt'],
        include: [
            {
                model: models_1.Admin,
                as: 'creator',
                attributes: ['username']
            }
        ],
        order: [['createdAt', 'DESC']],
        limit: Number(limit) / 4,
    });
    const recentMessages = await models_1.ChatMessage.findAll({
        attributes: ['id', 'username', 'message', 'createdAt'],
        include: [
            {
                model: models_1.MediaPage,
                as: 'page',
                attributes: ['title']
            }
        ],
        where: { isDeleted: false },
        order: [['createdAt', 'DESC']],
        limit: Number(limit) / 2,
    });
    const activity = {
        recentUsers,
        recentPages,
        recentMessages,
    };
    response_1.ResponseUtils.success(res, activity, '获取最近活动成功');
});
AdminController.healthCheck = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        environment: process.env.NODE_ENV,
    };
    response_1.ResponseUtils.success(res, health, '系统运行正常');
});
exports.default = AdminController;
//# sourceMappingURL=adminController.js.map