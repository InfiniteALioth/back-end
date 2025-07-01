import OSS from 'ali-oss';
import { config } from '../config';
import { IOSSUploadResult } from '../types';
import logger from './logger';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class OSSUtils {
  private static client: OSS;

  /**
   * 初始化 OSS 客户端
   */
  static initialize(): void {
    if (!config.OSS_ACCESS_KEY_ID || !config.OSS_ACCESS_KEY_SECRET || !config.OSS_BUCKET) {
      logger.warn('OSS 配置不完整，文件上传功能将不可用');
      return;
    }

    this.client = new OSS({
      region: config.OSS_REGION,
      accessKeyId: config.OSS_ACCESS_KEY_ID,
      accessKeySecret: config.OSS_ACCESS_KEY_SECRET,
      bucket: config.OSS_BUCKET,
      endpoint: config.OSS_ENDPOINT,
    });

    logger.info('OSS 客户端初始化成功');
  }

  /**
   * 上传文件到 OSS
   */
  static async uploadFile(
    file: Buffer | string,
    originalName: string,
    folder: string = 'uploads'
  ): Promise<IOSSUploadResult> {
    if (!this.client) {
      throw new Error('OSS 客户端未初始化');
    }

    try {
      const fileExtension = path.extname(originalName);
      const fileName = `${uuidv4()}${fileExtension}`;
      const objectName = `${folder}/${fileName}`;

      const result = await this.client.put(objectName, file);
      
      logger.info(`文件上传成功: ${objectName}`);
      
      return {
        name: objectName,
        url: result.url,
        res: result.res,
      };
    } catch (error) {
      logger.error('文件上传失败:', error);
      throw new Error('文件上传失败');
    }
  }

  /**
   * 上传多个文件到 OSS
   */
  static async uploadMultipleFiles(
    files: Array<{ buffer: Buffer; originalName: string }>,
    folder: string = 'uploads'
  ): Promise<IOSSUploadResult[]> {
    const uploadPromises = files.map(file =>
      this.uploadFile(file.buffer, file.originalName, folder)
    );

    return Promise.all(uploadPromises);
  }

  /**
   * 删除 OSS 文件
   */
  static async deleteFile(objectName: string): Promise<void> {
    if (!this.client) {
      throw new Error('OSS 客户端未初始化');
    }

    try {
      await this.client.delete(objectName);
      logger.info(`文件删除成功: ${objectName}`);
    } catch (error) {
      logger.error('文件删除失败:', error);
      throw new Error('文件删除失败');
    }
  }

  /**
   * 删除多个 OSS 文件
   */
  static async deleteMultipleFiles(objectNames: string[]): Promise<void> {
    if (!this.client) {
      throw new Error('OSS 客户端未初始化');
    }

    try {
      await this.client.deleteMulti(objectNames);
      logger.info(`批量删除文件成功: ${objectNames.join(', ')}`);
    } catch (error) {
      logger.error('批量删除文件失败:', error);
      throw new Error('批量删除文件失败');
    }
  }

  /**
   * 获取文件签名 URL
   */
  static async getSignedUrl(objectName: string, expires: number = 3600): Promise<string> {
    if (!this.client) {
      throw new Error('OSS 客户端未初始化');
    }

    try {
      return this.client.signatureUrl(objectName, { expires });
    } catch (error) {
      logger.error('获取签名 URL 失败:', error);
      throw new Error('获取签名 URL 失败');
    }
  }

  /**
   * 检查文件是否存在
   */
  static async fileExists(objectName: string): Promise<boolean> {
    if (!this.client) {
      throw new Error('OSS 客户端未初始化');
    }

    try {
      await this.client.head(objectName);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取文件信息
   */
  static async getFileInfo(objectName: string): Promise<any> {
    if (!this.client) {
      throw new Error('OSS 客户端未初始化');
    }

    try {
      return await this.client.head(objectName);
    } catch (error) {
      logger.error('获取文件信息失败:', error);
      throw new Error('获取文件信息失败');
    }
  }
}

export default OSSUtils;