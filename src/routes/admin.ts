import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { ValidationUtils } from '../utils/validation';
import { validate } from '../middleware/validation';
import { authenticate, requireAdmin, requireSuperAdmin } from '../middleware';

const router = Router();

// 创建管理员（需要超级管理员权限）
router.post(
  '/admins',
  authenticate,
  requireSuperAdmin,
  ValidationUtils.adminCreate(),
  validate,
  AdminController.createAdmin
);

// 获取管理员列表（需要管理员权限）
router.get(
  '/admins',
  authenticate,
  requireAdmin,
  ValidationUtils.paginationQuery(),
  validate,
  AdminController.getAdmins
);

// 获取用户列表（需要管理员权限）
router.get(
  '/users',
  authenticate,
  requireAdmin,
  ValidationUtils.paginationQuery(),
  validate,
  AdminController.getUsers
);

// 更新用户状态（需要管理员权限）
router.put(
  '/users/:id/status',
  authenticate,
  requireAdmin,
  ValidationUtils.uuidParam('id'),
  validate,
  AdminController.updateUserStatus
);

// 更新管理员状态（需要超级管理员权限）
router.put(
  '/admins/:id/status',
  authenticate,
  requireSuperAdmin,
  ValidationUtils.uuidParam('id'),
  validate,
  AdminController.updateAdminStatus
);

// 获取系统统计数据（需要管理员权限）
router.get(
  '/stats',
  authenticate,
  requireAdmin,
  AdminController.getSystemStats
);

// 获取最近活动（需要管理员权限）
router.get(
  '/activity',
  authenticate,
  requireAdmin,
  AdminController.getRecentActivity
);

// 系统健康检查（需要管理员权限）
router.get(
  '/health',
  authenticate,
  requireAdmin,
  AdminController.healthCheck
);

export default router;