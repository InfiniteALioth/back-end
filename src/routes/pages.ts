import { Router } from 'express';
import { PageController } from '../controllers/pageController';
import { ValidationUtils } from '../utils/validation';
import { validate } from '../middleware/validation';
import { authenticate, requireAdmin, optionalAuth } from '../middleware';

const router = Router();

// 创建媒体页面（需要管理员权限）
router.post(
  '/',
  authenticate,
  requireAdmin,
  ValidationUtils.mediaPageCreate(),
  validate,
  PageController.createPage
);

// 获取媒体页面列表（公开接口）
router.get(
  '/',
  optionalAuth,
  ValidationUtils.paginationQuery(),
  validate,
  PageController.getPages
);

// 获取我的媒体页面（需要管理员权限）
router.get(
  '/my',
  authenticate,
  requireAdmin,
  ValidationUtils.paginationQuery(),
  validate,
  PageController.getMyPages
);

// 根据内部代码获取媒体页面（公开接口）
router.get(
  '/code/:internalCode',
  ValidationUtils.internalCodeParam(),
  validate,
  PageController.getPageByCode
);

// 根据ID获取媒体页面
router.get(
  '/:id',
  optionalAuth,
  ValidationUtils.uuidParam('id'),
  validate,
  PageController.getPageById
);

// 更新媒体页面（需要管理员权限）
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  ValidationUtils.uuidParam('id'),
  ValidationUtils.mediaPageUpdate(),
  validate,
  PageController.updatePage
);

// 删除媒体页面（需要管理员权限）
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  ValidationUtils.uuidParam('id'),
  validate,
  PageController.deletePage
);

export default router;