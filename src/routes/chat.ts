import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { ValidationUtils } from '../utils/validation';
import { validate } from '../middleware/validation';
import { authenticate, requireAdmin, optionalAuth } from '../middleware';

const router = Router();

// 获取聊天消息列表（公开接口）
router.get(
  '/:pageId/messages',
  ValidationUtils.uuidParam('pageId'),
  ValidationUtils.paginationQuery(),
  validate,
  ChatController.getMessages
);

// 发送聊天消息（HTTP接口，主要用于测试）
router.post(
  '/:pageId/messages',
  optionalAuth,
  ValidationUtils.uuidParam('pageId'),
  ValidationUtils.chatMessageCreate(),
  validate,
  ChatController.sendMessage
);

// 删除聊天消息
router.delete(
  '/messages/:id',
  authenticate,
  ValidationUtils.uuidParam('id'),
  validate,
  ChatController.deleteMessage
);

// 获取页面聊天统计
router.get(
  '/:pageId/stats',
  optionalAuth,
  ValidationUtils.uuidParam('pageId'),
  validate,
  ChatController.getChatStats
);

// 清空页面聊天记录（管理员功能）
router.delete(
  '/:pageId/messages',
  authenticate,
  requireAdmin,
  ValidationUtils.uuidParam('pageId'),
  validate,
  ChatController.clearMessages
);

export default router;