import { Request, Response } from 'express';
import { User, Admin, MediaPage, MediaItem, ChatMessage } from '../models';
import { AuthService } from '../services/authService';
import { ResponseUtils } from '../utils/response';
import { IAuthRequest, AppError } from '../types';
import { asyncHandler } from '../middleware/errorHandler';
import { Op } from 'sequelize';

export class AdminController {
  /**
   * 创建管理员
   */
  static createAdmin = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { username, email, password, role } = req.body;

    const admin = await AuthService.createAdmin({
      username,
      email,
      password,
      role,
    });

    ResponseUtils.created(res, admin, '管理员创建成功');
  });

  /**
   * 获取管理员列表
   */
  static getAdmins = asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      role,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    // 搜索条件
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // 角色过滤
    if (role) {
      whereClause.role = role;
    }

    const { count, rows } = await Admin.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [[sortBy as string, sortOrder as string]],
      limit: Number(limit),
      offset,
    });

    const totalPages = Math.ceil(count / Number(limit));

    const result = {
      items: rows,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: count,
        itemsPerPage: Number(limit),
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    };

    ResponseUtils.paginated(res, result, '获取管理员列表成功');
  });

  /**
   * 获取用户列表
   */
  static getUsers = asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      isActive,
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);
    const whereClause: any = {};

    // 搜索条件
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // 状态过滤
    if (typeof isActive === 'string') {
      whereClause.isActive = isActive === 'true';
    }

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [[sortBy as string, sortOrder as string]],
      limit: Number(limit),
      offset,
    });

    const totalPages = Math.ceil(count / Number(limit));

    const result = {
      items: rows,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalItems: count,
        itemsPerPage: Number(limit),
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    };

    ResponseUtils.paginated(res, result, '获取用户列表成功');
  });

  /**
   * 更新用户状态
   */
  static updateUserStatus = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      throw new AppError('用户不存在', 404);
    }

    await user.update({ isActive });

    ResponseUtils.success(res, null, '用户状态更新成功');
  });

  /**
   * 更新管理员状态
   */
  static updateAdminStatus = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    // 防止禁用自己
    if (id === req.user!.id) {
      throw new AppError('不能禁用自己的账户', 400);
    }

    const admin = await Admin.findByPk(id);
    if (!admin) {
      throw new AppError('管理员不存在', 404);
    }

    await admin.update({ isActive });

    ResponseUtils.success(res, null, '管理员状态更新成功');
  });

  /**
   * 获取系统统计数据
   */
  static getSystemStats = asyncHandler(async (req: Request, res: Response) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      totalAdmins,
      totalPages,
      totalMediaItems,
      totalChatMessages,
      activePages,
      todayRegistrations,
      todayPageViews,
      todayMessages,
    ] = await Promise.all([
      User.count({ where: { isActive: true } }),
      Admin.count({ where: { isActive: true } }),
      MediaPage.count({ where: { isActive: true } }),
      MediaItem.count({ where: { isActive: true } }),
      ChatMessage.count({ where: { isDeleted: false } }),
      MediaPage.count({ where: { isActive: true, isPublic: true } }),
      User.count({
        where: {
          createdAt: { [Op.gte]: today }
        }
      }),
      MediaPage.sum('viewCount') || 0,
      ChatMessage.count({
        where: {
          isDeleted: false,
          createdAt: { [Op.gte]: today }
        }
      }),
    ]);

    const stats = {
      users: {
        total: totalUsers,
        todayRegistrations,
      },
      admins: {
        total: totalAdmins,
      },
      pages: {
        total: totalPages,
        active: activePages,
        totalViews: todayPageViews,
      },
      media: {
        totalItems: totalMediaItems,
      },
      chat: {
        totalMessages: totalChatMessages,
        todayMessages,
      },
      system: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version,
      },
    };

    ResponseUtils.success(res, stats, '获取系统统计成功');
  });

  /**
   * 获取最近活动
   */
  static getRecentActivity = asyncHandler(async (req: Request, res: Response) => {
    const { limit = 20 } = req.query;

    // 获取最近注册的用户
    const recentUsers = await User.findAll({
      attributes: ['id', 'username', 'email', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: Number(limit) / 4,
    });

    // 获取最近创建的页面
    const recentPages = await MediaPage.findAll({
      attributes: ['id', 'title', 'internalCode', 'createdAt'],
      include: [
        {
          model: Admin,
          as: 'creator',
          attributes: ['username']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit) / 4,
    });

    // 获取最近的聊天消息
    const recentMessages = await ChatMessage.findAll({
      attributes: ['id', 'username', 'message', 'createdAt'],
      include: [
        {
          model: MediaPage,
          as: 'page',
          attributes: ['title']
        }
      ],
      where: { isDeleted: false },
      order: [['createdAt', 'DESC']],
      limit: Number(limit) / 2,
    });

    const activity = {
      recentUsers,
      recentPages,
      recentMessages,
    };

    ResponseUtils.success(res, activity, '获取最近活动成功');
  });

  /**
   * 系统健康检查
   */
  static healthCheck = asyncHandler(async (req: Request, res: Response) => {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      environment: process.env.NODE_ENV,
    };

    ResponseUtils.success(res, health, '系统运行正常');
  });
}

export default AdminController;