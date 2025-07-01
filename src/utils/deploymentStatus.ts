import { config } from '../config';
import logger from './logger';

export interface DeploymentStatus {
  isDeployed: boolean;
  deploymentUrl?: string;
  status: 'not_deployed' | 'deploying' | 'deployed' | 'failed';
  lastDeployment?: {
    timestamp: string;
    version: string;
    environment: string;
  };
  healthCheck: {
    database: boolean;
    server: boolean;
  };
  buildInfo?: {
    version: string;
    buildTime: string;
    nodeVersion: string;
    environment: string;
  };
}

export class DeploymentStatusChecker {
  /**
   * 检查当前部署状态
   */
  async checkDeploymentStatus(): Promise<DeploymentStatus> {
    try {
      const healthCheck = await this.checkHealthStatus();
      const buildInfo = this.getBuildInfo();
      
      return {
        isDeployed: true,
        status: 'deployed',
        deploymentUrl: process.env.DEPLOYMENT_URL || `http://localhost:${config.PORT}`,
        lastDeployment: {
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || '1.0.0',
          environment: config.NODE_ENV
        },
        healthCheck,
        buildInfo
      };
    } catch (error) {
      logger.error('Failed to check deployment status:', error);
      return {
        isDeployed: false,
        status: 'failed',
        healthCheck: {
          database: false,
          server: false
        }
      };
    }
  }

  /**
   * 检查服务健康状态
   */
  async checkHealthStatus(): Promise<{ database: boolean; server: boolean }> {
    const health = {
      database: false,
      server: true // 如果能执行到这里，服务器就是运行的
    };

    try {
      // 检查数据库连接
      const sequelize = require('../config/database').default;
      await sequelize.authenticate();
      health.database = true;
    } catch (error) {
      logger.warn('Database health check failed:', error.message);
    }

    return health;
  }

  /**
   * 获取构建信息
   */
  getBuildInfo() {
    return {
      version: process.env.npm_package_version || '1.0.0',
      buildTime: new Date().toISOString(),
      nodeVersion: process.version,
      environment: config.NODE_ENV
    };
  }

  /**
   * 获取系统信息
   */
  getSystemInfo() {
    const os = require('os');
    return {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024) + 'MB',
        free: Math.round(os.freemem() / 1024 / 1024) + 'MB'
      },
      uptime: Math.round(os.uptime()) + 's'
    };
  }
}

export default new DeploymentStatusChecker();