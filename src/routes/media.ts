import { Router } from 'express';
import { MediaController } from '../controllers/mediaController';
import { ValidationUtils } from '../utils/validation';
import { validate } from '../middleware/validation';
import { authenticate, requireAdmin, optionalAuth } from '../middleware';

const router = Router();

// 创建媒体项（需要管理员权限）
router.post(
  '/',
  authenticate,
  requireAdmin,
  ValidationUtils.mediaItemCreate(),
  validate,
  MediaController.createMediaItem
);

// 获取指定页面的媒体项列表
router.get(
  '/page/:pageId',
  optionalAuth,
  ValidationUtils.uuidParam('pageId'),
  ValidationUtils.paginationQuery(),
  validate,
  MediaController.getMediaItems
);

// 更新媒体项（需要管理员权限）
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  ValidationUtils.uuidParam('id'),
  validate,
  MediaController.updateMediaItem
);

// 删除媒体项（需要管理员权限）
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  ValidationUtils.uuidParam('id'),
  validate,
  MediaController.deleteMediaItem
);

// 批量更新媒体项排序（需要管理员权限）
router.put(
  '/order/batch',
  authenticate,
  requireAdmin,
  MediaController.updateItemsOrder
);

export default router;