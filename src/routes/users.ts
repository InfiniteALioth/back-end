import { Router } from 'express';
import { User } from '../models';
import { ResponseUtils } from '../utils/response';
import { IAuthRequest, AppError } from '../types';
import { authenticate, requireUser } from '../middleware';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationUtils } from '../utils/validation';
import { validate } from '../middleware/validation';

const router = Router();

/**
 * 获取用户个人信息
 */
router.get(
  '/profile',
  authenticate,
  requireUser,
  asyncHandler(async (req: IAuthRequest, res: Response) => {
    const user = await User.findByPk(req.user!.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    ResponseUtils.success(res, user, '获取用户信息成功');
  })
);

/**
 * 更新用户个人信息
 */
router.put(
  '/profile',
  authenticate,
  requireUser,
  [
    ValidationUtils.userRegister()[0], // 用户名验证
    ValidationUtils.userRegister()[1], // 邮箱验证
  ],
  validate,
  asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { username, email, avatar } = req.body;

    const user = await User.findByPk(req.user!.id);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    // 检查用户名和邮箱是否被其他用户使用
    if (username !== user.username) {
      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        throw new AppError('用户名已被使用', 409);
      }
    }

    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new AppError('邮箱已被使用', 409);
      }
    }

    await user.update({ username, email, avatar });

    const updatedUser = user.toJSON();
    delete updatedUser.password;

    ResponseUtils.success(res, updatedUser, '用户信息更新成功');
  })
);

/**
 * 删除用户账户（软删除）
 */
router.delete(
  '/profile',
  authenticate,
  requireUser,
  asyncHandler(async (req: IAuthRequest, res: Response) => {
    const user = await User.findByPk(req.user!.id);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    await user.update({ isActive: false });

    ResponseUtils.success(res, null, '账户删除成功');
  })
);

export default router;