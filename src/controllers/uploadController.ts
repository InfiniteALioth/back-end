import { Request, Response } from 'express';
import { UploadService } from '../services/uploadService';
import { ResponseUtils } from '../utils/response';
import { IAuthRequest, AppError } from '../types';
import { asyncHandler } from '../middleware/errorHandler';

export class UploadController {
  /**
   * 上传单个文件
   */
  static uploadSingle = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const file = req.file;
    const { folder = 'uploads' } = req.body;

    if (!file) {
      throw new AppError('没有文件被上传', 400);
    }

    const result = await UploadService.uploadSingleFile(file, folder);

    ResponseUtils.success(res, result, '文件上传成功');
  });

  /**
   * 上传多个文件
   */
  static uploadMultiple = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const { folder = 'uploads' } = req.body;

    if (!files || files.length === 0) {
      throw new AppError('没有文件被上传', 400);
    }

    const results = await UploadService.uploadMultipleFiles(files, folder);

    ResponseUtils.success(res, results, '文件批量上传成功');
  });

  /**
   * 上传头像
   */
  static uploadAvatar = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const file = req.file;

    if (!file) {
      throw new AppError('没有头像文件被上传', 400);
    }

    const avatarUrl = await UploadService.uploadAvatar(file, req.user!.id);

    ResponseUtils.success(res, { avatarUrl }, '头像上传成功');
  });

  /**
   * 上传媒体文件
   */
  static uploadMedia = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const file = req.file;
    const { pageId } = req.body;

    if (!file) {
      throw new AppError('没有媒体文件被上传', 400);
    }

    if (!pageId) {
      throw new AppError('页面ID不能为空', 400);
    }

    const result = await UploadService.uploadMediaFile(file, pageId);

    ResponseUtils.success(res, result, '媒体文件上传成功');
  });

  /**
   * 删除文件
   */
  static deleteFile = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { filename } = req.params;

    await UploadService.deleteFile(filename);

    ResponseUtils.success(res, null, '文件删除成功');
  });

  /**
   * 批量删除文件
   */
  static deleteMultipleFiles = asyncHandler(async (req: IAuthRequest, res: Response) => {
    const { filenames } = req.body;

    if (!Array.isArray(filenames) || filenames.length === 0) {
      throw new AppError('文件名列表不能为空', 400);
    }

    await UploadService.deleteMultipleFiles(filenames);

    ResponseUtils.success(res, null, '文件批量删除成功');
  });

  /**
   * 获取文件签名URL
   */
  static getSignedUrl = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;
    const { expires = 3600 } = req.query;

    const url = await UploadService.getSignedUrl(filename, Number(expires));

    ResponseUtils.success(res, { url }, '获取文件签名URL成功');
  });

  /**
   * 获取文件信息
   */
  static getFileInfo = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    const info = await UploadService.getFileInfo(filename);

    ResponseUtils.success(res, info, '获取文件信息成功');
  });

  /**
   * 检查文件是否存在
   */
  static checkFileExists = asyncHandler(async (req: Request, res: Response) => {
    const { filename } = req.params;

    const exists = await UploadService.fileExists(filename);

    ResponseUtils.success(res, { exists }, '文件存在性检查完成');
  });
}

export default UploadController;