import { Request, Response } from 'express';
import { ChatMessage, MediaPage } from '../models';
import { ResponseUtils } from '../utils/response';
import { IAuthRequest, AppError } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { Op } from 'sequelize';

export class ChatController {
  /**
   * 获取聊天消息列表
   */
  static getMessages = asyncHandler(async (req: Request, res: Response) => {
    const { pageId } = req.params;
    const {
      page = 1,
      limit = 50,
      before,
      after,
    } = req.query;

    // 验证页面是否存在且公开
    const mediaPage = await MediaPage.findOne({
      where: { id: pageId, isActive: true, isPublic: true }
    });

    if (!mediaPage) {
      throw new AppError('页面不存在或未公开', 404);
    }

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {
      pageId,
      isDeleted: false,
    };

    // 时间范围过滤
    if (before) {
      whereClause.createdAt = { [Op.lt]: new Date(before as string) };
    }
    if (after) {
      whereClause.createdAt = { [Op.gt]: new Date(after as string) };
    }

    const { count, rows } = await ChatMessage.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset,
      attributes: ['id', 'userId', 'username', 'message', 'messageType', 'createdAt'],
    });

    const totalPages = Math.ceil(count / Number(limit));

    const result = {
      items: rows.reverse(), // 反转顺序，最新消息在底部
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: count,
        itemsPerPage: Number(limit),
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    };

    ResponseUtils.paginated(res, result, '获取聊天消息成功');
  });

  /**
   * 发送聊天消息（HTTP接口，主要用于测试）
   */
  static sendMessage = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { pageId } = req.params;
    const { message, messageType = 'text' } = req.body;

    // 验证页面是否存在且公开
    const mediaPage = await MediaPage.findOne({
      where: { id: pageId, isActive: true, isPublic: true }
    });

    if (!mediaPage) {
      throw new AppError('页面不存在或未公开', 404);
    }

    // 创建消息
    const chatMessage = await ChatMessage.create({
      pageId,
      userId: req.user?.id,
      username: req.user?.username || '匿名用户',
      message,
      messageType,
    });

    ResponseUtils.created(res, {
      id: chatMessage.id,
      pageId: chatMessage.pageId,
      userId: chatMessage.userId,
      username: chatMessage.username,
      message: chatMessage.message,
      messageType: chatMessage.messageType,
      createdAt: chatMessage.createdAt,
    }, '消息发送成功');
  });

  /**
   * 删除聊天消息（软删除）
   */
  static deleteMessage = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;

    const message = await ChatMessage.findOne({
      where: { id, isDeleted: false }
    });

    if (!message) {
      throw new AppError('消息不存在', 404);
    }

    // 检查权限：只有消息发送者或管理员可以删除
    if (req.user!.type !== 'admin' && message.userId !== req.user!.id) {
      throw new AppError('无权删除此消息', 403);
    }

    await message.update({ isDeleted: true });

    ResponseUtils.success(res, null, '消息删除成功');
  });

  /**
   * 获取页面聊天统计
   */
  static getChatStats = asyncHandler(async (req: Request, res: Response) => {
    const { pageId } = req.params;

    // 验证页面是否存在
    const mediaPage = await MediaPage.findOne({
      where: { id: pageId, isActive: true }
    });

    if (!mediaPage) {
      throw new AppError('页面不存在', 404);
    }

    // 获取统计数据
    const totalMessages = await ChatMessage.count({
      where: { pageId, isDeleted: false }
    });

    const todayMessages = await ChatMessage.count({
      where: {
        pageId,
        isDeleted: false,
        createdAt: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    const uniqueUsers = await ChatMessage.count({
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

    ResponseUtils.success(res, stats, '获取聊天统计成功');
  });

  /**
   * 清空页面聊天记录（管理员功能）
   */
  static clearMessages = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { pageId } = req.params;

    // 验证页面是否存在
    const mediaPage = await MediaPage.findOne({
      where: { id: pageId, isActive: true }
    });

    if (!mediaPage) {
      throw new AppError('页面不存在', 404);
    }

    // 软删除所有消息
    const deletedCount = await ChatMessage.update(
      { isDeleted: true },
      {
        where: { pageId, isDeleted: false }
      }
    );

    ResponseUtils.success(res, { deletedCount: deletedCount[0] }, '聊天记录清空成功');
  });
}

export default ChatController;