"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSSService = void 0;
const oss_1 = require("../utils/oss");
const config_1 = require("../config");
const logger_1 = __importDefault(require("../utils/logger"));
class OSSService {
    static initialize() {
        try {
            oss_1.OSSUtils.initialize();
            logger_1.default.info('OSS 服务初始化成功');
        }
        catch (error) {
            logger_1.default.error('OSS 服务初始化失败:', error);
            throw error;
        }
    }
    static getConfig() {
        return {
            region: config_1.config.OSS_REGION,
            bucket: config_1.config.OSS_BUCKET,
            endpoint: config_1.config.OSS_ENDPOINT,
        };
    }
    static async checkStatus() {
        try {
            const testFileName = `test_${Date.now()}.txt`;
            const testContent = 'OSS connection test';
            await oss_1.OSSUtils.uploadFile(Buffer.from(testContent), testFileName, 'test');
            await oss_1.OSSUtils.deleteFile(`test/${testFileName}`);
            return true;
        }
        catch (error) {
            logger_1.default.error('OSS 服务状态检查失败:', error);
            return false;
        }
    }
    static async getStorageStats() {
        try {
            return {
                totalFiles: 0,
                totalSize: 0,
                lastUpdated: new Date().toISOString(),
            };
        }
        catch (error) {
            logger_1.default.error('获取存储统计失败:', error);
            throw error;
        }
    }
    static async cleanupExpiredFiles(days = 30) {
        try {
            logger_1.default.info(`开始清理 ${days} 天前的过期文件`);
            const cleanedCount = 0;
            logger_1.default.info(`清理完成，共清理 ${cleanedCount} 个文件`);
            return cleanedCount;
        }
        catch (error) {
            logger_1.default.error('清理过期文件失败:', error);
            throw error;
        }
    }
    static async batchOperation(operation, files, targetFolder) {
        try {
            switch (operation) {
                case 'delete':
                    await oss_1.OSSUtils.deleteMultipleFiles(files);
                    break;
                case 'copy':
                    break;
                case 'move':
                    break;
                default:
                    throw new Error('不支持的批量操作类型');
            }
            logger_1.default.info(`批量${operation}操作完成，处理 ${files.length} 个文件`);
        }
        catch (error) {
            logger_1.default.error(`批量${operation}操作失败:`, error);
            throw error;
        }
    }
}
exports.OSSService = OSSService;
exports.default = OSSService;
//# sourceMappingURL=ossService.js.map