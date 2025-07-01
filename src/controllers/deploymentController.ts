import { Request, Response } from 'express';
import deploymentStatusChecker from '../utils/deploymentStatus';
import { ResponseUtils } from '../utils/response';
import { asyncHandler } from '../middleware/errorHandler';

export class DeploymentController {
  /**
   * 获取部署状态
   * GET /api/v1/deployment/status
   */
  static getDeploymentStatus = asyncHandler(async (req: Request, res: Response) => {
    const status = await deploymentStatusChecker.checkDeploymentStatus();
    ResponseUtils.success(res, status, '获取部署状态成功');
  });

  /**
   * 健康检查
   * GET /api/v1/deployment/health
   */
  static healthCheck = asyncHandler(async (req: Request, res: Response) => {
    const healthStatus = await deploymentStatusChecker.checkHealthStatus();
    const isHealthy = healthStatus.database && healthStatus.server;
    
    if (isHealthy) {
      ResponseUtils.success(res, healthStatus, '系统运行正常');
    } else {
      ResponseUtils.error(res, '系统运行异常', 503, JSON.stringify(healthStatus));
    }
  });

  /**
   * 获取部署信息
   * GET /api/v1/deployment/info
   */
  static getDeploymentInfo = asyncHandler(async (req: Request, res: Response) => {
    const deploymentInfo = deploymentStatusChecker.getDeploymentInfo();
    ResponseUtils.success(res, deploymentInfo, '获取部署信息成功');
  });
}

export default DeploymentController;