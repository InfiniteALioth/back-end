"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSSUtils = void 0;
const ali_oss_1 = __importDefault(require("ali-oss"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("./logger"));
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
class OSSUtils {
    static initialize() {
        if (!config_1.config.OSS_ACCESS_KEY_ID || !config_1.config.OSS_ACCESS_KEY_SECRET || !config_1.config.OSS_BUCKET) {
            logger_1.default.warn('OSS 配置不完整，文件上传功能将不可用');
            return;
        }
        this.client = new ali_oss_1.default({
            region: config_1.config.OSS_REGION,
            accessKeyId: config_1.config.OSS_ACCESS_KEY_ID,
            accessKeySecret: config_1.config.OSS_ACCESS_KEY_SECRET,
            bucket: config_1.config.OSS_BUCKET,
            endpoint: config_1.config.OSS_ENDPOINT,
        });
        logger_1.default.info('OSS 客户端初始化成功');
    }
    static async uploadFile(file, originalName, folder = 'uploads') {
        if (!this.client) {
            throw new Error('OSS 客户端未初始化');
        }
        try {
            const fileExtension = path_1.default.extname(originalName);
            const fileName = `${(0, uuid_1.v4)()}${fileExtension}`;
            const objectName = `${folder}/${fileName}`;
            const result = await this.client.put(objectName, file);
            logger_1.default.info(`文件上传成功: ${objectName}`);
            return {
                name: objectName,
                url: result.url,
                res: result.res,
            };
        }
        catch (error) {
            logger_1.default.error('文件上传失败:', error);
            throw new Error('文件上传失败');
        }
    }
    static async uploadMultipleFiles(files, folder = 'uploads') {
        const uploadPromises = files.map(file => this.uploadFile(file.buffer, file.originalName, folder));
        return Promise.all(uploadPromises);
    }
    static async deleteFile(objectName) {
        if (!this.client) {
            throw new Error('OSS 客户端未初始化');
        }
        try {
            await this.client.delete(objectName);
            logger_1.default.info(`文件删除成功: ${objectName}`);
        }
        catch (error) {
            logger_1.default.error('文件删除失败:', error);
            throw new Error('文件删除失败');
        }
    }
    static async deleteMultipleFiles(objectNames) {
        if (!this.client) {
            throw new Error('OSS 客户端未初始化');
        }
        try {
            await this.client.deleteMulti(objectNames);
            logger_1.default.info(`批量删除文件成功: ${objectNames.join(', ')}`);
        }
        catch (error) {
            logger_1.default.error('批量删除文件失败:', error);
            throw new Error('批量删除文件失败');
        }
    }
    static async getSignedUrl(objectName, expires = 3600) {
        if (!this.client) {
            throw new Error('OSS 客户端未初始化');
        }
        try {
            return this.client.signatureUrl(objectName, { expires });
        }
        catch (error) {
            logger_1.default.error('获取签名 URL 失败:', error);
            throw new Error('获取签名 URL 失败');
        }
    }
    static async fileExists(objectName) {
        if (!this.client) {
            throw new Error('OSS 客户端未初始化');
        }
        try {
            await this.client.head(objectName);
            return true;
        }
        catch (error) {
            return false;
        }
    }
    static async getFileInfo(objectName) {
        if (!this.client) {
            throw new Error('OSS 客户端未初始化');
        }
        try {
            return await this.client.head(objectName);
        }
        catch (error) {
            logger_1.default.error('获取文件信息失败:', error);
            throw new Error('获取文件信息失败');
        }
    }
}
exports.OSSUtils = OSSUtils;
exports.default = OSSUtils;
//# sourceMappingURL=oss.js.map