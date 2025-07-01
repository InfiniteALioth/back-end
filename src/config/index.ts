import dotenv from 'dotenv';
import { IEnvConfig } from '../types';

dotenv.config();

export const config: IEnvConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3001', 10),
  API_VERSION: process.env.API_VERSION || 'v1',
  
  // 数据库配置
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306', 10),
  DB_NAME: process.env.DB_NAME || 'interactive_media_platform',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  
  // JWT 配置
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your_refresh_token_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  
  // 阿里云 OSS 配置
  OSS_REGION: process.env.OSS_REGION || 'oss-cn-hangzhou',
  OSS_ACCESS_KEY_ID: process.env.OSS_ACCESS_KEY_ID || '',
  OSS_ACCESS_KEY_SECRET: process.env.OSS_ACCESS_KEY_SECRET || '',
  OSS_BUCKET: process.env.OSS_BUCKET || '',
  OSS_ENDPOINT: process.env.OSS_ENDPOINT || 'https://oss-cn-hangzhou.aliyuncs.com',
  
  // 其他配置
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || '50MB',
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,video/mp4,video/webm,audio/mp3,audio/wav',
};

// 验证必需的环境变量
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

export default config;