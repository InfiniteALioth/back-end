import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { ResponseUtils } from '../utils/response';
import { IAuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

export class AuthController {
  /**
   * 用户注册
   */
  static register = asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password, avatar } = req.body;

    const result = await AuthService.registerUser({
      username,
      email,
      password,
      avatar,
    });

    ResponseUtils.created(res, result, '注册成功');
  });

  /**
   * 用户登录
   */
  static login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.loginUser(email, password);

    ResponseUtils.success(res, result, '登录成功');
  });

  /**
   * 管理员登录
   */
  static adminLogin = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const result = await AuthService.loginAdmin(email, password);

    ResponseUtils.success(res, result, '管理员登录成功');
  });

  /**
   * 刷新令牌
   */
  static refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const tokens = await AuthService.refreshTokens(refreshToken);

    ResponseUtils.success(res, tokens, '令牌刷新成功');
  });

  /**
   * 获取当前用户信息
   */
  static getCurrentUser = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const user = await AuthService.validateUser(req.user!.id, req.user!.type);

    // 移除密码字段
    const userResponse = user.toJSON();
    delete userResponse.password;

    ResponseUtils.success(res, userResponse, '获取用户信息成功');
  });

  /**
   * 修改密码
   */
  static changePassword = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    await AuthService.changePassword(
      req.user!.id,
      req.user!.type,
      oldPassword,
      newPassword
    );

    ResponseUtils.success(res, null, '密码修改成功');
  });

  /**
   * 登出（客户端处理，服务端记录日志）
   */
  static logout = asyncHandler(async (req: IAuthRequest, res: Response) => {
    // 这里可以添加登出日志记录
    // 实际的令牌失效由客户端处理（删除本地存储的令牌）
    
    ResponseUtils.success(res, null, '登出成功');
  });

  /**
   * 验证令牌有效性
   */
  static validateToken = asyncHandler(async (req: IAuthRequest, res: Response) => {
    // 如果能到达这里，说明令牌有效（通过了认证中间件）
    ResponseUtils.success(res, {
      valid: true,
      user: {
        id: req.user!.id,
        username: req.user!.username,
        email: req.user!.email,
        type: req.user!.type,
        role: req.user!.role,
      },
    }, '令牌有效');
  });
}

export default AuthController;