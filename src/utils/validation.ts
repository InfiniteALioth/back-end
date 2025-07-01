import { body, param, query, ValidationChain } from 'express-validator';

export class ValidationUtils {
  // 用户验证规则
  static userRegister(): ValidationChain[] {
    return [
      body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('用户名长度必须在3-20个字符之间')
        .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/)
        .withMessage('用户名只能包含字母、数字、下划线和中文'),
      
      body('email')
        .isEmail()
        .withMessage('请输入有效的邮箱地址')
        .normalizeEmail(),
      
      body('password')
        .isLength({ min: 6, max: 50 })
        .withMessage('密码长度必须在6-50个字符之间')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('密码必须包含至少一个小写字母、一个大写字母和一个数字'),
    ];
  }

  static userLogin(): ValidationChain[] {
    return [
      body('email')
        .isEmail()
        .withMessage('请输入有效的邮箱地址')
        .normalizeEmail(),
      
      body('password')
        .notEmpty()
        .withMessage('密码不能为空'),
    ];
  }

  // 管理员验证规则
  static adminLogin(): ValidationChain[] {
    return [
      body('email')
        .isEmail()
        .withMessage('请输入有效的邮箱地址')
        .normalizeEmail(),
      
      body('password')
        .notEmpty()
        .withMessage('密码不能为空'),
    ];
  }

  static adminCreate(): ValidationChain[] {
    return [
      body('username')
        .isLength({ min: 3, max: 20 })
        .withMessage('用户名长度必须在3-20个字符之间'),
      
      body('email')
        .isEmail()
        .withMessage('请输入有效的邮箱地址')
        .normalizeEmail(),
      
      body('password')
        .isLength({ min: 8, max: 50 })
        .withMessage('密码长度必须在8-50个字符之间'),
      
      body('role')
        .isIn(['admin', 'super_admin'])
        .withMessage('角色必须是 admin 或 super_admin'),
    ];
  }

  // 媒体页面验证规则
  static mediaPageCreate(): ValidationChain[] {
    return [
      body('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('标题长度必须在1-100个字符之间'),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('描述长度不能超过500个字符'),
      
      body('internalCode')
        .isLength({ min: 3, max: 50 })
        .withMessage('内部代码长度必须在3-50个字符之间')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('内部代码只能包含字母、数字、下划线和连字符'),
      
      body('isPublic')
        .optional()
        .isBoolean()
        .withMessage('isPublic 必须是布尔值'),
    ];
  }

  static mediaPageUpdate(): ValidationChain[] {
    return [
      body('title')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('标题长度必须在1-100个字符之间'),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('描述长度不能超过500个字符'),
      
      body('isPublic')
        .optional()
        .isBoolean()
        .withMessage('isPublic 必须是布尔值'),
      
      body('isActive')
        .optional()
        .isBoolean()
        .withMessage('isActive 必须是布尔值'),
    ];
  }

  // 媒体项验证规则
  static mediaItemCreate(): ValidationChain[] {
    return [
      body('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('标题长度必须在1-100个字符之间'),
      
      body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('描述长度不能超过500个字符'),
      
      body('mediaType')
        .isIn(['image', 'video', 'audio'])
        .withMessage('媒体类型必须是 image、video 或 audio'),
      
      body('mediaUrl')
        .isURL()
        .withMessage('媒体URL格式不正确'),
      
      body('thumbnailUrl')
        .optional()
        .isURL()
        .withMessage('缩略图URL格式不正确'),
      
      body('fileSize')
        .isInt({ min: 1 })
        .withMessage('文件大小必须是正整数'),
      
      body('duration')
        .optional()
        .isInt({ min: 0 })
        .withMessage('时长必须是非负整数'),
      
      body('sortOrder')
        .optional()
        .isInt({ min: 0 })
        .withMessage('排序必须是非负整数'),
    ];
  }

  // 聊天消息验证规则
  static chatMessageCreate(): ValidationChain[] {
    return [
      body('username')
        .isLength({ min: 1, max: 50 })
        .withMessage('用户名长度必须在1-50个字符之间'),
      
      body('message')
        .isLength({ min: 1, max: 1000 })
        .withMessage('消息长度必须在1-1000个字符之间'),
      
      body('messageType')
        .optional()
        .isIn(['text', 'image', 'emoji'])
        .withMessage('消息类型必须是 text、image 或 emoji'),
    ];
  }

  // 参数验证规则
  static uuidParam(paramName: string = 'id'): ValidationChain {
    return param(paramName)
      .isUUID()
      .withMessage(`${paramName} 必须是有效的UUID格式`);
  }

  static internalCodeParam(): ValidationChain {
    return param('internalCode')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('内部代码格式不正确');
  }

  // 查询参数验证规则
  static paginationQuery(): ValidationChain[] {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('页码必须是正整数'),
      
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('每页数量必须在1-100之间'),
      
      query('sortBy')
        .optional()
        .isString()
        .withMessage('排序字段必须是字符串'),
      
      query('sortOrder')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('排序方向必须是 ASC 或 DESC'),
    ];
  }

  // 刷新令牌验证规则
  static refreshToken(): ValidationChain[] {
    return [
      body('refreshToken')
        .notEmpty()
        .withMessage('刷新令牌不能为空'),
    ];
  }
}

export default ValidationUtils;