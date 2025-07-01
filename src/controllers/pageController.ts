import { Request, Response } from 'express';
import { MediaService } from '../services/mediaService';
import { ResponseUtils } from '../utils/response';
import { IAuthRequest } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

export class PageController {
  /**
   * 创建媒体页面
   */
  static createPage = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { title, description, internalCode, isPublic } = req.body;

    const page = await MediaService.createMediaPage({
      title,
      description,
      internalCode,
      isPublic,
      createdBy: req.user!.id,
    });

    ResponseUtils.created(res, page, '媒体页面创建成功');
  });

  /**
   * 获取媒体页面列表
   */
  static getPages = asyncHandler(async (req: Request, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      isPublic,
      createdBy,
    } = req.query;

    const result = await MediaService.getMediaPages({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
      search: search as string,
      isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
      createdBy: createdBy as string,
    });

    ResponseUtils.paginated(res, result, '获取媒体页面列表成功');
  });

  /**
   * 根据ID获取媒体页面
   */
  static getPageById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const includeItems = req.query.includeItems !== 'false';

    const page = await MediaService.getMediaPageById(id, includeItems);

    ResponseUtils.success(res, page, '获取媒体页面成功');
  });

  /**
   * 根据内部代码获取媒体页面（公开访问）
   */
  static getPageByCode = asyncHandler(async (req: Request, res: Response) => {
    const { internalCode } = req.params;

    const page = await MediaService.getMediaPageByCode(internalCode);

    ResponseUtils.success(res, page, '获取媒体页面成功');
  });

  /**
   * 更新媒体页面
   */
  static updatePage = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;
    const { title, description, isPublic, isActive } = req.body;

    const page = await MediaService.updateMediaPage(id, {
      title,
      description,
      isPublic,
      isActive,
    });

    ResponseUtils.success(res, page, '媒体页面更新成功');
  });

  /**
   * 删除媒体页面
   */
  static deletePage = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { id } = req.params;

    await MediaService.deleteMediaPage(id);

    ResponseUtils.success(res, null, '媒体页面删除成功');
  });

  /**
   * 获取我的媒体页面
   */
  static getMyPages = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
    } = req.query;

    const result = await MediaService.getMediaPages({
      page: Number(page),
      limit: Number(limit),
      sortBy: sortBy as string,
      sortOrder: sortOrder as 'ASC' | 'DESC',
      search: search as string,
      createdBy: req.user!.id,
    });

    ResponseUtils.paginated(res, result, '获取我的媒体页面成功');
  });
}

export default PageController;