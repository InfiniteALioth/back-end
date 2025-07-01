import { config } from '../config';
import logger from './logger';
import sequelize from '../config/database';

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
}

export class DeploymentStatusChecker {
  /**
   * 检查当前部署状态
   */
  async checkDeploymentStatus(): Promise<DeploymentStatus> {
    try {
      // 检查健康状态
      const healthStatus = await this.checkHealthStatus();
      
      // 获取部署信息
      const deploymentInfo = this.getDeploymentInfo();
      
      return {
        isDeployed: true,
        deploymentUrl: process.env.DEPLOYMENT_URL || 'https://api.interactive-media.example.com',
        status: 'deployed',
        lastDeployment: {
          timestamp: new Date().toISOString(),
          version: process.env.APP_VERSION || '1.0.0',
          environment: config.NODE_ENV
        },
        healthCheck: healthStatus
      };
    } catch (error) {
      logger.error('Failed to check deployment status:', error);
      
      return {
        isDeployed: false,
        status: 'failed',
        healthCheck: {
          database: false,
          server: true
        }
      };
    }
  }

  /**
   * 检查服务健康状态
   */
  async checkHealthStatus(): Promise<{ database: boolean; server: boolean }> {
    const healthStatus = {
      database: false,
      server: true // 服务器正在运行，所以为true
    };
    
    try {
      // 检查数据库连接
      await sequelize.authenticate();
      healthStatus.database = true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      healthStatus.database = false;
    }
    
    return healthStatus;
  }

  /**
   * 获取部署信息
   */
  getDeploymentInfo(): any {
    return {
      version: process.env.APP_VERSION || '1.0.0',
      environment: config.NODE_ENV,
      deployedAt: process.env.DEPLOYED_AT || new Date().toISOString(),
      deployedBy: process.env.DEPLOYED_BY || 'system',
      commitHash: process.env.COMMIT_HASH || 'unknown'
    };
  }
}

export default new DeploymentStatusChecker();