import { Router } from 'express';
import DeploymentController from '../controllers/deploymentController';
import { authenticate, requireAdmin, optionalAuth } from '../middleware';

const router = Router();

// GET /deployment/status - 获取部署状态（需要管理员权限）
router.get('/status', authenticate, requireAdmin, DeploymentController.getDeploymentStatus);

// GET /deployment/health - 健康检查（公开接口）
router.get('/health', DeploymentController.healthCheck);

// GET /deployment/info - 获取部署信息（需要管理员权限）
router.get('/info', authenticate, requireAdmin, DeploymentController.getDeploymentInfo);

export default router;