import multer from 'multer';
import { Request } from 'express';
import { config } from '../config';
import { AppError } from '../types';
import path from 'path';

// 解析文件大小字符串（如 "50MB"）
const parseFileSize = (sizeStr: string): number => {
  const units: { [key: string]: number } = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
  };

  const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([A-Z]+)$/i);
  if (!match) {
    throw new Error('无效的文件大小格式');
  }

  const [, size, unit] = match;
  const multiplier = units[unit.toUpperCase()];
  
  if (!multiplier) {
    throw new Error('不支持的文件大小单位');
  }

  return parseFloat(size) * multiplier;
};

// 获取允许的文件类型
const getAllowedMimeTypes = (): string[] => {
  return config.ALLOWED_FILE_TYPES.split(',').map(type => type.trim());
};

// 文件过滤器
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = getAllowedMimeTypes();
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`不支持的文件类型: ${file.mimetype}`, 400));
  }
};

// 存储配置（内存存储，用于上传到 OSS）
const storage = multer.memoryStorage();

// 基础上传配置
const uploadConfig: multer.Options = {
  storage,
  fileFilter,
  limits: {
    fileSize: parseFileSize(config.MAX_FILE_SIZE),
    files: 10, // 最多同时上传10个文件
  },
};

// 单文件上传中间件
export const uploadSingle = (fieldName: string = 'file') => {
  return multer(uploadConfig).single(fieldName);
};

// 多文件上传中间件
export const uploadMultiple = (fieldName: string = 'files', maxCount: number = 10) => {
  return multer(uploadConfig).array(fieldName, maxCount);
};

// 多字段文件上传中间件
export const uploadFields = (fields: multer.Field[]) => {
  return multer(uploadConfig).fields(fields);
};

// 任意文件上传中间件
export const uploadAny = () => {
  return multer(uploadConfig).any();
};

// 文件类型检查工具函数
export const getFileType = (mimetype: string): 'image' | 'video' | 'audio' | 'other' => {
  if (mimetype.startsWith('image/')) {
    return 'image';
  } else if (mimetype.startsWith('video/')) {
    return 'video';
  } else if (mimetype.startsWith('audio/')) {
    return 'audio';
  } else {
    return 'other';
  }
};

// 生成文件名
export const generateFileName = (originalName: string): string => {
  const ext = path.extname(originalName);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}_${random}${ext}`;
};

// 验证文件扩展名
export const validateFileExtension = (filename: string, allowedExtensions: string[]): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
};

export default {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  uploadAny,
  getFileType,
  generateFileName,
  validateFileExtension,
};