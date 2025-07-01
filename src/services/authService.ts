import { BcryptUtils } from '../utils/bcrypt';
import { JWTUtils } from '../utils/jwt';
import { User, Admin } from '../models';
import { IUserCreate, IAdminCreate, ITokens, IJwtPayload, AppError } from '../types';
import logger from '../utils/logger';

export class AuthService {
  /**
   * 用户注册
   */
  static async registerUser(userData: IUserCreate): Promise<{ user: any; tokens: ITokens }> {
    try {
      // 检查用户是否已存在
      const existingUser = await User.findOne({
        where: {
          $or: [
            { email: userData.email },
            { username: userData.username }
          ]
        }
      });

      if (existingUser) {
        throw new AppError('用户名或邮箱已存在', 409);
      }

      // 哈希密码
      const hashedPassword = await BcryptUtils.hashPassword(userData.password);

      // 创建用户
      const user = await User.create({
        ...userData,
        password: hashedPassword,
      });

      // 生成令牌
      const tokenPayload: Omit<IJwtPayload, 'iat' | 'exp'> = {
        id: user.id,
        username: user.username,
        email: user.email,
        type: 'user',
      };

      const tokens = JWTUtils.generateTokens(tokenPayload);

      // 更新最后登录时间
      await user.update({ lastLoginAt: new Date() });

      // 移除密码字段
      const userResponse = user.toJSON();
      delete userResponse.password;

      logger.info(`用户注册成功: ${user.email}`);

      return { user: userResponse, tokens };
    } catch (error) {
      logger.error('用户注册失败:', error);
      throw error;
    }
  }

  /**
   * 用户登录
   */
  static async loginUser(email: string, password: string): Promise<{ user: any; tokens: ITokens }> {
    try {
      // 查找用户
      const user = await User.findOne({ where: { email, isActive: true } });
      if (!user) {
        throw new AppError('用户不存在或已被禁用', 401);
      }

      // 验证密码
      const isPasswordValid = await BcryptUtils.comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('密码错误', 401);
      }

      // 生成令牌
      const tokenPayload: Omit<IJwtPayload, 'iat' | 'exp'> = {
        id: user.id,
        username: user.username,
        email: user.email,
        type: 'user',
      };

      const tokens = JWTUtils.generateTokens(tokenPayload);

      // 更新最后登录时间
      await user.update({ lastLoginAt: new Date() });

      // 移除密码字段
      const userResponse = user.toJSON();
      delete userResponse.password;

      logger.info(`用户登录成功: ${user.email}`);

      return { user: userResponse, tokens };
    } catch (error) {
      logger.error('用户登录失败:', error);
      throw error;
    }
  }

  /**
   * 管理员登录
   */
  static async loginAdmin(email: string, password: string): Promise<{ admin: any; tokens: ITokens }> {
    try {
      // 查找管理员
      const admin = await Admin.findOne({ where: { email, isActive: true } });
      if (!admin) {
        throw new AppError('管理员不存在或已被禁用', 401);
      }

      // 验证密码
      const isPasswordValid = await BcryptUtils.comparePassword(password, admin.password);
      if (!isPasswordValid) {
        throw new AppError('密码错误', 401);
      }

      // 生成令牌
      const tokenPayload: Omit<IJwtPayload, 'iat' | 'exp'> = {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        type: 'admin',
        role: admin.role,
      };

      const tokens = JWTUtils.generateTokens(tokenPayload);

      // 更新最后登录时间
      await admin.update({ lastLoginAt: new Date() });

      // 移除密码字段
      const adminResponse = admin.toJSON();
      delete adminResponse.password;

      logger.info(`管理员登录成功: ${admin.email}`);

      return { admin: adminResponse, tokens };
    } catch (error) {
      logger.error('管理员登录失败:', error);
      throw error;
    }
  }

  /**
   * 创建管理员
   */
  static async createAdmin(adminData: IAdminCreate): Promise<any> {
    try {
      // 检查管理员是否已存在
      const existingAdmin = await Admin.findOne({
        where: {
          $or: [
            { email: adminData.email },
            { username: adminData.username }
          ]
        }
      });

      if (existingAdmin) {
        throw new AppError('管理员用户名或邮箱已存在', 409);
      }

      // 哈希密码
      const hashedPassword = await BcryptUtils.hashPassword(adminData.password);

      // 创建管理员
      const admin = await Admin.create({
        ...adminData,
        password: hashedPassword,
      });

      // 移除密码字段
      const adminResponse = admin.toJSON();
      delete adminResponse.password;

      logger.info(`管理员创建成功: ${admin.email}`);

      return adminResponse;
    } catch (error) {
      logger.error('管理员创建失败:', error);
      throw error;
    }
  }

  /**
   * 刷新令牌
   */
  static async refreshTokens(refreshToken: string): Promise<ITokens> {
    try {
      // 验证刷新令牌
      const decoded = JWTUtils.verifyRefreshToken(refreshToken);

      // 根据用户类型查找用户
      let user;
      if (decoded.type === 'user') {
        user = await User.findByPk(decoded.id);
      } else if (decoded.type === 'admin') {
        user = await Admin.findByPk(decoded.id);
      }

      if (!user || !user.isActive) {
        throw new AppError('用户不存在或已被禁用', 401);
      }

      // 生成新的令牌对
      const tokenPayload: Omit<IJwtPayload, 'iat' | 'exp'> = {
        id: user.id,
        username: user.username,
        email: user.email,
        type: decoded.type,
        role: decoded.role,
      };

      const tokens = JWTUtils.generateTokens(tokenPayload);

      logger.info(`令牌刷新成功: ${user.email}`);

      return tokens;
    } catch (error) {
      logger.error('令牌刷新失败:', error);
      throw error;
    }
  }

  /**
   * 验证用户权限
   */
  static async validateUser(userId: string, userType: 'user' | 'admin'): Promise<any> {
    try {
      let user;
      if (userType === 'user') {
        user = await User.findByPk(userId);
      } else {
        user = await Admin.findByPk(userId);
      }

      if (!user || !user.isActive) {
        throw new AppError('用户不存在或已被禁用', 401);
      }

      return user;
    } catch (error) {
      logger.error('用户验证失败:', error);
      throw error;
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(
    userId: string,
    userType: 'user' | 'admin',
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      const user = await this.validateUser(userId, userType);

      // 验证旧密码
      const isOldPasswordValid = await BcryptUtils.comparePassword(oldPassword, user.password);
      if (!isOldPasswordValid) {
        throw new AppError('原密码错误', 400);
      }

      // 哈希新密码
      const hashedNewPassword = await BcryptUtils.hashPassword(newPassword);

      // 更新密码
      await user.update({ password: hashedNewPassword });

      logger.info(`密码修改成功: ${user.email}`);
    } catch (error) {
      logger.error('密码修改失败:', error);
      throw error;
    }
  }
}

export default AuthService;