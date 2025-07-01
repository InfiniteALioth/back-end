import { Request, Response } from 'express';
import { MediaService } from '../services/mediaService';
import { ResponseUtils } from '../utils/response';
import { IAuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

export class MediaController {
  /**
   * 创建媒体项
   */
  static createMediaItem = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const {
      pageId,
      title,
      description,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      fileSize,
      duration,
      sortOrder,
    } = req.body;

    const item = await MediaService.createMediaItem({
      pageId,
      title,
      description,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      fileSize,
      duration,
      sortOrder,
    });

    ResponseUtils.created(res, item, '媒体项创建成功');
  });

  /**
   * 获取媒体项列表
   */
  static getMediaItems = asyncHandler(async (req: Request, res: Response) => {
    const { pageId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = 'sortOrder',
      sortOrder = 'ASC',
    } = req.query;

    const result = await MediaService.getMediaItems(pageId, {
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
    });

    ResponseUtils.paginated(res, result, '获取媒体项列表成功');
  });

  /**
   * 更新媒体项
   */
  static updateMediaItem = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, sortOrder, isActive } = req.body;

    const item = await MediaService.updateMediaItem(id, {
      title,
      description,
      sortOrder,
      isActive,
    });

    ResponseUtils.success(res, item, '媒体项更新成功');
  });

  /**
   * 删除媒体项
   */
  static deleteMediaItem = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;

    await MediaService.deleteMediaItem(id);

    ResponseUtils.success(res, null, '媒体项删除成功');
  });

  /**
   * 批量更新媒体项排序
   */
  static updateItemsOrder = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return ResponseUtils.error(res, '参数格式错误', 400);
    }

    await MediaService.updateMediaItemsOrder(items);

    ResponseUtils.success(res, null, '媒体项排序更新成功');
  });
}

export default MediaController;