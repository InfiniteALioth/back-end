import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { uploadSingle, uploadMultiple, uploadRateLimit } from '../middleware';
import { authenticate, requireAdmin, optionalAuth } from '../middleware';

const router = Router();

// 上传单个文件（需要认证）
router.post(
  '/single',
  authenticate,
  uploadRateLimit,
  uploadSingle('file'),
  UploadController.uploadSingle
);

// 上传多个文件（需要认证）
router.post(
  '/multiple',
  authenticate,
  uploadRateLimit,
  uploadMultiple('files', 10),
  UploadController.uploadMultiple
);

// 上传头像（需要认证）
router.post(
  '/avatar',
  authenticate,
  uploadRateLimit,
  uploadSingle('avatar'),
  UploadController.uploadAvatar
);

// 上传媒体文件（需要管理员权限）
router.post(
  '/media',
  authenticate,
  requireAdmin,
  uploadRateLimit,
  uploadSingle('media'),
  UploadController.uploadMedia
);

// 删除文件（需要管理员权限）
router.delete(
  '/:filename',
  authenticate,
  requireAdmin,
  UploadController.deleteFile
);

// 批量删除文件（需要管理员权限）
router.delete(
  '/',
  authenticate,
  requireAdmin,
  UploadController.deleteMultipleFiles
);

// 获取文件签名URL
router.get(
  '/:filename/signed-url',
  optionalAuth,
  UploadController.getSignedUrl
);

// 获取文件信息
router.get(
  '/:filename/info',
  optionalAuth,
  UploadController.getFileInfo
);

// 检查文件是否存在
router.get(
  '/:filename/exists',
  optionalAuth,
  UploadController.checkFileExists
);

export default router;