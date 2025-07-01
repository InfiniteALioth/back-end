import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { ValidationUtils } from '../utils/validation';
import { validate } from '../middleware/validation';
import { authenticate, authRateLimit } from '../middleware';

const router = Router();

// 用户注册
router.post(
  '/register',
  authRateLimit,
  ValidationUtils.userRegister(),
  validate,
  AuthController.register
);

// 用户登录
router.post(
  '/login',
  authRateLimit,
  ValidationUtils.userLogin(),
  validate,
  AuthController.login
);

// 管理员登录
router.post(
  '/admin/login',
  authRateLimit,
  ValidationUtils.adminLogin(),
  validate,
  AuthController.adminLogin
);

// 刷新令牌
router.post(
  '/refresh',
  ValidationUtils.refreshToken(),
  validate,
  AuthController.refreshToken
);

// 获取当前用户信息
router.get(
  '/me',
  authenticate,
  AuthController.getCurrentUser
);

// 修改密码
router.put(
  '/change-password',
  authenticate,
  [
    ValidationUtils.userLogin()[1], // 复用密码验证
    ValidationUtils.userRegister()[2], // 复用新密码验证
  ],
  validate,
  AuthController.changePassword
);

// 登出
router.post(
  '/logout',
  authenticate,
  AuthController.logout
);

// 验证令牌
router.get(
  '/validate',
  authenticate,
  AuthController.validateToken
);

export default router;