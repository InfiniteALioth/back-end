"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const models_1 = require("../models");
const response_1 = require("../utils/response");
const types_1 = require("../types");
const errorHandler_1 = require("../middleware/errorHandler");
const sequelize_1 = require("sequelize");
class ChatController {
}
exports.ChatController = ChatController;
_a = ChatController;
ChatController.getMessages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pageId } = req.params;
    const { page = 1, limit = 50, before, after, } = req.query;
    const mediaPage = await models_1.MediaPage.findOne({
        where: { id: pageId, isActive: true, isPublic: true }
    });
    if (!mediaPage) {
        throw new types_1.AppError('页面不存在或未公开', 404);
    }
    const offset = (Number(page) - 1) * Number(limit);
    const whereClause = {
        pageId,
        isDeleted: false,
    };
    if (before) {
        whereClause.createdAt = { [sequelize_1.Op.lt]: new Date(before) };
    }
    if (after) {
        whereClause.createdAt = { [sequelize_1.Op.gt]: new Date(after) };
    }
    const { count, rows } = await models_1.ChatMessage.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: Number(limit),
        offset,
        attributes: ['id', 'userId', 'username', 'message', 'messageType', 'createdAt'],
    });
    const totalPages = Math.ceil(count / Number(limit));
    const result = {
        items: rows.reverse(),
        pagination: {
            currentPage: Number(page),
            totalPages,
            totalItems: count,
            itemsPerPage: Number(limit),
            hasNextPage: Number(page) < totalPages,
            hasPrevPage: Number(page) > 1,
        },
    };
    response_1.ResponseUtils.paginated(res, result, '获取聊天消息成功');
});
ChatController.sendMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pageId } = req.params;
    const { message, messageType = 'text' } = req.body;
    const mediaPage = await models_1.MediaPage.findOne({
        where: { id: pageId, isActive: true, isPublic: true }
    });
    if (!mediaPage) {
        throw new types_1.AppError('页面不存在或未公开', 404);
    }
    const chatMessage = await models_1.ChatMessage.create({
        pageId,
        userId: req.user?.id,
        username: req.user?.username || '匿名用户',
        message,
        messageType,
    });
    response_1.ResponseUtils.created(res, {
        id: chatMessage.id,
        pageId: chatMessage.pageId,
        userId: chatMessage.userId,
        username: chatMessage.username,
        message: chatMessage.message,
        messageType: chatMessage.messageType,
        createdAt: chatMessage.createdAt,
    }, '消息发送成功');
});
ChatController.deleteMessage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const message = await models_1.ChatMessage.findOne({
        where: { id, isDeleted: false }
    });
    if (!message) {
        throw new types_1.AppError('消息不存在', 404);
    }
    if (req.user.type !== 'admin' && message.userId !== req.user.id) {
        throw new types_1.AppError('无权删除此消息', 403);
    }
    await message.update({ isDeleted: true });
    response_1.ResponseUtils.success(res, null, '消息删除成功');
});
ChatController.getChatStats = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pageId } = req.params;
    const mediaPage = await models_1.MediaPage.findOne({
        where: { id: pageId, isActive: true }
    });
    if (!mediaPage) {
        throw new types_1.AppError('页面不存在', 404);
    }
    const totalMessages = await models_1.ChatMessage.count({
        where: { pageId, isDeleted: false }
    });
    const todayMessages = await models_1.ChatMessage.count({
        where: {
            pageId,
            isDeleted: false,
            createdAt: {
                [sequelize_1.Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
            }
        }
    });
    const uniqueUsers = await models_1.ChatMessage.count({
        where: { pageId, isDeleted: false },
        distinct: true,
        col: 'userId'
    });
    const stats = {
        totalMessages,
        todayMessages,
        uniqueUsers,
        pageTitle: mediaPage.title,
    };
    response_1.ResponseUtils.success(res, stats, '获取聊天统计成功');
});
ChatController.clearMessages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pageId } = req.params;
    const mediaPage = await models_1.MediaPage.findOne({
        where: { id: pageId, isActive: true }
    });
    if (!mediaPage) {
        throw new types_1.AppError('页面不存在', 404);
    }
    const deletedCount = await models_1.ChatMessage.update({ isDeleted: true }, {
        where: { pageId, isDeleted: false }
    });
    response_1.ResponseUtils.success(res, { deletedCount: deletedCount[0] }, '聊天记录清空成功');
});
exports.default = ChatController;
//# sourceMappingURL=chatController.js.map