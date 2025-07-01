import { OSSUtils } from '../utils/oss';
import { getFileType, generateFileName } from '../middleware/upload';
import { AppError } from '../types';
import logger from '../utils/logger';
import path from 'path';

export class UploadService {
  /**
   * 上传单个文件
   */
  static async uploadSingleFile(
    file: Express.Multer.File,
    folder: string = 'uploads'
  ): Promise<{ url: string; filename: string; size: number; type: string }> {
    try {
      if (!file) {
        throw new AppError('没有文件被上传', 400);
      }

      // 生成新的文件名
      const filename = generateFileName(file.originalname);
      
      // 根据文件类型确定存储文件夹
      const fileType = getFileType(file.mimetype);
      const fullFolder = `${folder}/${fileType}s`;

      // 上传到 OSS
      const result = await OSSUtils.uploadFile(file.buffer, filename, fullFolder);

      logger.info(`文件上传成功: ${result.name}`);

      return {
        url: result.url,
        filename: result.name,
        size: file.size,
        type: fileType,
      };
    } catch (error) {
      logger.error('文件上传失败:', error);
      throw error;
    }
  }

  /**
   * 上传多个文件
   */
  static async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'uploads'
  ): Promise<Array<{ url: string; filename: string; size: number; type: string }>> {
    try {
      if (!files || files.length === 0) {
        throw new AppError('没有文件被上传', 400);
      }

      const uploadPromises = files.map(file => this.uploadSingleFile(file, folder));
      const results = await Promise.all(uploadPromises);

      logger.info(`批量文件上传成功，共 ${results.length} 个文件`);

      return results;
    } catch (error) {
      logger.error('批量文件上传失败:', error);
      throw error;
    }
  }

  /**
   * 删除文件
   */
  static async deleteFile(filename: string): Promise<void> {
    try {
      await OSSUtils.deleteFile(filename);
      logger.info(`文件删除成功: ${filename}`);
    } catch (error) {
      logger.error('文件删除失败:', error);
      throw error;
    }
  }

  /**
   * 批量删除文件
   */
  static async deleteMultipleFiles(filenames: string[]): Promise<void> {
    try {
      await OSSUtils.deleteMultipleFiles(filenames);
      logger.info(`批量文件删除成功，共 ${filenames.length} 个文件`);
    } catch (error) {
      logger.error('批量文件删除失败:', error);
      throw error;
    }
  }

  /**
   * 获取文件签名URL
   */
  static async getSignedUrl(filename: string, expires: number = 3600): Promise<string> {
    try {
      const url = await OSSUtils.getSignedUrl(filename, expires);
      return url;
    } catch (error) {
      logger.error('获取文件签名URL失败:', error);
      throw error;
    }
  }

  /**
   * 验证文件类型
   */
  static validateFileType(file: Express.Multer.File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.mimetype);
  }

  /**
   * 验证文件大小
   */
  static validateFileSize(file: Express.Multer.File, maxSize: number): boolean {
    return file.size <= maxSize;
  }

  /**
   * 获取文件信息
   */
  static async getFileInfo(filename: string): Promise<any> {
    try {
      const info = await OSSUtils.getFileInfo(filename);
      return info;
    } catch (error) {
      logger.error('获取文件信息失败:', error);
      throw error;
    }
  }

  /**
   * 检查文件是否存在
   */
  static async fileExists(filename: string): Promise<boolean> {
    try {
      return await OSSUtils.fileExists(filename);
    } catch (error) {
      logger.error('检查文件存在性失败:', error);
      return false;
    }
  }

  /**
   * 处理头像上传
   */
  static async uploadAvatar(file: Express.Multer.File, userId: string): Promise<string> {
    try {
      // 验证文件类型（只允许图片）
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!this.validateFileType(file, allowedTypes)) {
        throw new AppError('头像只能是 JPEG、PNG 或 GIF 格式', 400);
      }

      // 验证文件大小（最大 5MB）
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (!this.validateFileSize(file, maxSize)) {
        throw new AppError('头像文件大小不能超过 5MB', 400);
      }

      // 生成头像文件名
      const ext = path.extname(file.originalname);
      const filename = `avatar_${userId}_${Date.now()}${ext}`;

      // 上传到 avatars 文件夹
      const result = await OSSUtils.uploadFile(file.buffer, filename, 'avatars');

      return result.url;
    } catch (error) {
      logger.error('头像上传失败:', error);
      throw error;
    }
  }

  /**
   * 处理媒体文件上传
   */
  static async uploadMediaFile(
    file: Express.Multer.File,
    pageId: string
  ): Promise<{ url: string; thumbnailUrl?: string; duration?: number }> {
    try {
      const fileType = getFileType(file.mimetype);
      
      // 验证媒体文件类型
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif',
        'video/mp4', 'video/webm',
        'audio/mp3', 'audio/wav'
      ];
      
      if (!this.validateFileType(file, allowedTypes)) {
        throw new AppError('不支持的媒体文件类型', 400);
      }

      // 上传主文件
      const result = await this.uploadSingleFile(file, `media/${pageId}`);

      // 如果是视频文件，可以在这里生成缩略图
      // 这里简化处理，实际项目中可能需要使用 FFmpeg 等工具
      let thumbnailUrl: string | undefined;
      let duration: number | undefined;

      if (fileType === 'video') {
        // TODO: 实现视频缩略图生成和时长获取
        // thumbnailUrl = await this.generateVideoThumbnail(file);
        // duration = await this.getVideoDuration(file);
      }

      return {
        url: result.url,
        thumbnailUrl,
        duration,
      };
    } catch (error) {
      logger.error('媒体文件上传失败:', error);
      throw error;
    }
  }
}

export default UploadService;