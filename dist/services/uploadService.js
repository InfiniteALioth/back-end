"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const oss_1 = require("../utils/oss");
const upload_1 = require("../middleware/upload");
const types_1 = require("../types");
const logger_1 = __importDefault(require("../utils/logger"));
const path_1 = __importDefault(require("path"));
class UploadService {
    static async uploadSingleFile(file, folder = 'uploads') {
        try {
            if (!file) {
                throw new types_1.AppError('没有文件被上传', 400);
            }
            const filename = (0, upload_1.generateFileName)(file.originalname);
            const fileType = (0, upload_1.getFileType)(file.mimetype);
            const fullFolder = `${folder}/${fileType}s`;
            const result = await oss_1.OSSUtils.uploadFile(file.buffer, filename, fullFolder);
            logger_1.default.info(`文件上传成功: ${result.name}`);
            return {
                url: result.url,
                filename: result.name,
                size: file.size,
                type: fileType,
            };
        }
        catch (error) {
            logger_1.default.error('文件上传失败:', error);
            throw error;
        }
    }
    static async uploadMultipleFiles(files, folder = 'uploads') {
        try {
            if (!files || files.length === 0) {
                throw new types_1.AppError('没有文件被上传', 400);
            }
            const uploadPromises = files.map(file => this.uploadSingleFile(file, folder));
            const results = await Promise.all(uploadPromises);
            logger_1.default.info(`批量文件上传成功，共 ${results.length} 个文件`);
            return results;
        }
        catch (error) {
            logger_1.default.error('批量文件上传失败:', error);
            throw error;
        }
    }
    static async deleteFile(filename) {
        try {
            await oss_1.OSSUtils.deleteFile(filename);
            logger_1.default.info(`文件删除成功: ${filename}`);
        }
        catch (error) {
            logger_1.default.error('文件删除失败:', error);
            throw error;
        }
    }
    static async deleteMultipleFiles(filenames) {
        try {
            await oss_1.OSSUtils.deleteMultipleFiles(filenames);
            logger_1.default.info(`批量文件删除成功，共 ${filenames.length} 个文件`);
        }
        catch (error) {
            logger_1.default.error('批量文件删除失败:', error);
            throw error;
        }
    }
    static async getSignedUrl(filename, expires = 3600) {
        try {
            const url = await oss_1.OSSUtils.getSignedUrl(filename, expires);
            return url;
        }
        catch (error) {
            logger_1.default.error('获取文件签名URL失败:', error);
            throw error;
        }
    }
    static validateFileType(file, allowedTypes) {
        return allowedTypes.includes(file.mimetype);
    }
    static validateFileSize(file, maxSize) {
        return file.size <= maxSize;
    }
    static async getFileInfo(filename) {
        try {
            const info = await oss_1.OSSUtils.getFileInfo(filename);
            return info;
        }
        catch (error) {
            logger_1.default.error('获取文件信息失败:', error);
            throw error;
        }
    }
    static async fileExists(filename) {
        try {
            return await oss_1.OSSUtils.fileExists(filename);
        }
        catch (error) {
            logger_1.default.error('检查文件存在性失败:', error);
            return false;
        }
    }
    static async uploadAvatar(file, userId) {
        try {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!this.validateFileType(file, allowedTypes)) {
                throw new types_1.AppError('头像只能是 JPEG、PNG 或 GIF 格式', 400);
            }
            const maxSize = 5 * 1024 * 1024;
            if (!this.validateFileSize(file, maxSize)) {
                throw new types_1.AppError('头像文件大小不能超过 5MB', 400);
            }
            const ext = path_1.default.extname(file.originalname);
            const filename = `avatar_${userId}_${Date.now()}${ext}`;
            const result = await oss_1.OSSUtils.uploadFile(file.buffer, filename, 'avatars');
            return result.url;
        }
        catch (error) {
            logger_1.default.error('头像上传失败:', error);
            throw error;
        }
    }
    static async uploadMediaFile(file, pageId) {
        try {
            const fileType = (0, upload_1.getFileType)(file.mimetype);
            const allowedTypes = [
                'image/jpeg', 'image/png', 'image/gif',
                'video/mp4', 'video/webm',
                'audio/mp3', 'audio/wav'
            ];
            if (!this.validateFileType(file, allowedTypes)) {
                throw new types_1.AppError('不支持的媒体文件类型', 400);
            }
            const result = await this.uploadSingleFile(file, `media/${pageId}`);
            let thumbnailUrl;
            let duration;
            if (fileType === 'video') {
            }
            return {
                url: result.url,
                thumbnailUrl,
                duration,
            };
        }
        catch (error) {
            logger_1.default.error('媒体文件上传失败:', error);
            throw error;
        }
    }
}
exports.UploadService = UploadService;
exports.default = UploadService;
//# sourceMappingURL=uploadService.js.map