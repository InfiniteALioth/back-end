"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    API_VERSION: process.env.API_VERSION || 'v1',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
    DB_NAME: process.env.DB_NAME || 'interactive_media_platform',
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    OSS_REGION: process.env.OSS_REGION || 'oss-cn-hangzhou',
    OSS_ACCESS_KEY_ID: process.env.OSS_ACCESS_KEY_ID || '',
    OSS_ACCESS_KEY_SECRET: process.env.OSS_ACCESS_KEY_SECRET || '',
    OSS_BUCKET: process.env.OSS_BUCKET || '',
    OSS_ENDPOINT: process.env.OSS_ENDPOINT || 'https://oss-cn-hangzhou.aliyuncs.com',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '50MB',
    ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,video/mp4,video/webm,audio/mp3,audio/wav',
};
const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'DB_PASSWORD'
];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error(`缺少必需的环境变量: ${missingEnvVars.join(', ')}`);
    console.error('请检查 .env 文件配置');
    process.exit(1);
}
exports.default = exports.config;
//# sourceMappingURL=index.js.map