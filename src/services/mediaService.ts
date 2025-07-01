import { MediaPage, MediaItem, Admin } from '../models';
import { IMediaPageCreate, IMediaPageUpdate, IMediaItemCreate, IMediaItemUpdate, IPaginationQuery, IPaginationResult, AppError } from '../types';
import { Op } from 'sequelize';
import logger from '../utils/logger';

export class MediaService {
  /**
   * 创建媒体页面
   */
  static async createMediaPage(pageData: IMediaPageCreate): Promise<any> {
    try {
      // 检查内部代码是否已存在
      const existingPage = await MediaPage.findOne({
        where: { internalCode: pageData.internalCode }
      });

      if (existingPage) {
        throw new AppError('内部代码已存在', 409);
      }

      const page = await MediaPage.create(pageData);

      logger.info(`媒体页面创建成功: ${page.id}`);

      return page;
    } catch (error) {
      logger.error('媒体页面创建失败:', error);
      throw error;
    }
  }

  /**
   * 获取媒体页面列表
   */
  static async getMediaPages(
    query: IPaginationQuery & { search?: string; isPublic?: boolean; createdBy?: string }
  ): Promise<IPaginationResult<any>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        search,
        isPublic,
        createdBy
      } = query;

      const offset = (page - 1) * limit;
      const whereClause: any = { isActive: true };

      // 搜索条件
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { internalCode: { [Op.like]: `%${search}%` } }
        ];
      }

      // 公开状态过滤
      if (typeof isPublic === 'boolean') {
        whereClause.isPublic = isPublic;
      }

      // 创建者过滤
      if (createdBy) {
        whereClause.createdBy = createdBy;
      }

      const { count, rows } = await MediaPage.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Admin,
            as: 'creator',
            attributes: ['id', 'username', 'email']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      return {
        items: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      logger.error('获取媒体页面列表失败:', error);
      throw error;
    }
  }

  /**
   * 根据ID获取媒体页面
   */
  static async getMediaPageById(id: string, includeItems: boolean = true): Promise<any> {
    try {
      const includeOptions: any[] = [
        {
          model: Admin,
          as: 'creator',
          attributes: ['id', 'username', 'email']
        }
      ];

      if (includeItems) {
        includeOptions.push({
          model: MediaItem,
          as: 'mediaItems',
          where: { isActive: true },
          required: false,
          order: [['sortOrder', 'ASC']]
        });
      }

      const page = await MediaPage.findOne({
        where: { id, isActive: true },
        include: includeOptions,
      });

      if (!page) {
        throw new AppError('媒体页面不存在', 404);
      }

      return page;
    } catch (error) {
      logger.error('获取媒体页面失败:', error);
      throw error;
    }
  }

  /**
   * 根据内部代码获取媒体页面
   */
  static async getMediaPageByCode(internalCode: string): Promise<any> {
    try {
      const page = await MediaPage.findOne({
        where: { internalCode, isActive: true, isPublic: true },
        include: [
          {
            model: MediaItem,
            as: 'mediaItems',
            where: { isActive: true },
            required: false,
            order: [['sortOrder', 'ASC']]
          },
          {
            model: Admin,
            as: 'creator',
            attributes: ['id', 'username']
          }
        ],
      });

      if (!page) {
        throw new AppError('媒体页面不存在或未公开', 404);
      }

      // 增加浏览次数
      await page.increment('viewCount');

      return page;
    } catch (error) {
      logger.error('获取媒体页面失败:', error);
      throw error;
    }
  }

  /**
   * 更新媒体页面
   */
  static async updateMediaPage(id: string, updateData: IMediaPageUpdate): Promise<any> {
    try {
      const page = await MediaPage.findOne({
        where: { id, isActive: true }
      });

      if (!page) {
        throw new AppError('媒体页面不存在', 404);
      }

      await page.update(updateData);

      logger.info(`媒体页面更新成功: ${id}`);

      return page;
    } catch (error) {
      logger.error('媒体页面更新失败:', error);
      throw error;
    }
  }

  /**
   * 删除媒体页面（软删除）
   */
  static async deleteMediaPage(id: string): Promise<void> {
    try {
      const page = await MediaPage.findOne({
        where: { id, isActive: true }
      });

      if (!page) {
        throw new AppError('媒体页面不存在', 404);
      }

      // 软删除页面和相关媒体项
      await page.update({ isActive: false });
      await MediaItem.update(
        { isActive: false },
        { where: { pageId: id } }
      );

      logger.info(`媒体页面删除成功: ${id}`);
    } catch (error) {
      logger.error('媒体页面删除失败:', error);
      throw error;
    }
  }

  /**
   * 创建媒体项
   */
  static async createMediaItem(itemData: IMediaItemCreate): Promise<any> {
    try {
      // 验证页面是否存在
      const page = await MediaPage.findOne({
        where: { id: itemData.pageId, isActive: true }
      });

      if (!page) {
        throw new AppError('媒体页面不存在', 404);
      }

      // 如果没有指定排序，设置为最大值+1
      if (!itemData.sortOrder) {
        const maxSortOrder = await MediaItem.max('sortOrder', {
          where: { pageId: itemData.pageId, isActive: true }
        }) as number;
        itemData.sortOrder = (maxSortOrder || 0) + 1;
      }

      const item = await MediaItem.create(itemData);

      logger.info(`媒体项创建成功: ${item.id}`);

      return item;
    } catch (error) {
      logger.error('媒体项创建失败:', error);
      throw error;
    }
  }

  /**
   * 获取媒体项列表
   */
  static async getMediaItems(
    pageId: string,
    query: IPaginationQuery
  ): Promise<IPaginationResult<any>> {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'sortOrder',
        sortOrder = 'ASC'
      } = query;

      const offset = (page - 1) * limit;

      const { count, rows } = await MediaItem.findAndCountAll({
        where: { pageId, isActive: true },
        order: [[sortBy, sortOrder]],
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit);

      return {
        items: rows,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: count,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      logger.error('获取媒体项列表失败:', error);
      throw error;
    }
  }

  /**
   * 更新媒体项
   */
  static async updateMediaItem(id: string, updateData: IMediaItemUpdate): Promise<any> {
    try {
      const item = await MediaItem.findOne({
        where: { id, isActive: true }
      });

      if (!item) {
        throw new AppError('媒体项不存在', 404);
      }

      await item.update(updateData);

      logger.info(`媒体项更新成功: ${id}`);

      return item;
    } catch (error) {
      logger.error('媒体项更新失败:', error);
      throw error;
    }
  }

  /**
   * 删除媒体项（软删除）
   */
  static async deleteMediaItem(id: string): Promise<void> {
    try {
      const item = await MediaItem.findOne({
        where: { id, isActive: true }
      });

      if (!item) {
        throw new AppError('媒体项不存在', 404);
      }

      await item.update({ isActive: false });

      logger.info(`媒体项删除成功: ${id}`);
    } catch (error) {
      logger.error('媒体项删除失败:', error);
      throw error;
    }
  }

  /**
   * 批量更新媒体项排序
   */
  static async updateMediaItemsOrder(items: Array<{ id: string; sortOrder: number }>): Promise<void> {
    try {
      const updatePromises = items.map(item =>
        MediaItem.update(
          { sortOrder: item.sortOrder },
          { where: { id: item.id, isActive: true } }
        )
      );

      await Promise.all(updatePromises);

      logger.info('媒体项排序更新成功');
    } catch (error) {
      logger.error('媒体项排序更新失败:', error);
      throw error;
    }
  }
}

export default MediaService;