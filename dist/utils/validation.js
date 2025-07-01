"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationUtils = void 0;
const express_validator_1 = require("express-validator");
class ValidationUtils {
    static userRegister() {
        return [
            (0, express_validator_1.body)('username')
                .isLength({ min: 3, max: 20 })
                .withMessage('用户名长度必须在3-20个字符之间')
                .matches(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/)
                .withMessage('用户名只能包含字母、数字、下划线和中文'),
            (0, express_validator_1.body)('email')
                .isEmail()
                .withMessage('请输入有效的邮箱地址')
                .normalizeEmail(),
            (0, express_validator_1.body)('password')
                .isLength({ min: 6, max: 50 })
                .withMessage('密码长度必须在6-50个字符之间')
                .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
                .withMessage('密码必须包含至少一个小写字母、一个大写字母和一个数字'),
        ];
    }
    static userLogin() {
        return [
            (0, express_validator_1.body)('email')
                .isEmail()
                .withMessage('请输入有效的邮箱地址')
                .normalizeEmail(),
            (0, express_validator_1.body)('password')
                .notEmpty()
                .withMessage('密码不能为空'),
        ];
    }
    static adminLogin() {
        return [
            (0, express_validator_1.body)('email')
                .isEmail()
                .withMessage('请输入有效的邮箱地址')
                .normalizeEmail(),
            (0, express_validator_1.body)('password')
                .notEmpty()
                .withMessage('密码不能为空'),
        ];
    }
    static adminCreate() {
        return [
            (0, express_validator_1.body)('username')
                .isLength({ min: 3, max: 20 })
                .withMessage('用户名长度必须在3-20个字符之间'),
            (0, express_validator_1.body)('email')
                .isEmail()
                .withMessage('请输入有效的邮箱地址')
                .normalizeEmail(),
            (0, express_validator_1.body)('password')
                .isLength({ min: 8, max: 50 })
                .withMessage('密码长度必须在8-50个字符之间'),
            (0, express_validator_1.body)('role')
                .isIn(['admin', 'super_admin'])
                .withMessage('角色必须是 admin 或 super_admin'),
        ];
    }
    static mediaPageCreate() {
        return [
            (0, express_validator_1.body)('title')
                .isLength({ min: 1, max: 100 })
                .withMessage('标题长度必须在1-100个字符之间'),
            (0, express_validator_1.body)('description')
                .optional()
                .isLength({ max: 500 })
                .withMessage('描述长度不能超过500个字符'),
            (0, express_validator_1.body)('internalCode')
                .isLength({ min: 3, max: 50 })
                .withMessage('内部代码长度必须在3-50个字符之间')
                .matches(/^[a-zA-Z0-9_-]+$/)
                .withMessage('内部代码只能包含字母、数字、下划线和连字符'),
            (0, express_validator_1.body)('isPublic')
                .optional()
                .isBoolean()
                .withMessage('isPublic 必须是布尔值'),
        ];
    }
    static mediaPageUpdate() {
        return [
            (0, express_validator_1.body)('title')
                .optional()
                .isLength({ min: 1, max: 100 })
                .withMessage('标题长度必须在1-100个字符之间'),
            (0, express_validator_1.body)('description')
                .optional()
                .isLength({ max: 500 })
                .withMessage('描述长度不能超过500个字符'),
            (0, express_validator_1.body)('isPublic')
                .optional()
                .isBoolean()
                .withMessage('isPublic 必须是布尔值'),
            (0, express_validator_1.body)('isActive')
                .optional()
                .isBoolean()
                .withMessage('isActive 必须是布尔值'),
        ];
    }
    static mediaItemCreate() {
        return [
            (0, express_validator_1.body)('title')
                .isLength({ min: 1, max: 100 })
                .withMessage('标题长度必须在1-100个字符之间'),
            (0, express_validator_1.body)('description')
                .optional()
                .isLength({ max: 500 })
                .withMessage('描述长度不能超过500个字符'),
            (0, express_validator_1.body)('mediaType')
                .isIn(['image', 'video', 'audio'])
                .withMessage('媒体类型必须是 image、video 或 audio'),
            (0, express_validator_1.body)('mediaUrl')
                .isURL()
                .withMessage('媒体URL格式不正确'),
            (0, express_validator_1.body)('thumbnailUrl')
                .optional()
                .isURL()
                .withMessage('缩略图URL格式不正确'),
            (0, express_validator_1.body)('fileSize')
                .isInt({ min: 1 })
                .withMessage('文件大小必须是正整数'),
            (0, express_validator_1.body)('duration')
                .optional()
                .isInt({ min: 0 })
                .withMessage('时长必须是非负整数'),
            (0, express_validator_1.body)('sortOrder')
                .optional()
                .isInt({ min: 0 })
                .withMessage('排序必须是非负整数'),
        ];
    }
    static chatMessageCreate() {
        return [
            (0, express_validator_1.body)('username')
                .isLength({ min: 1, max: 50 })
                .withMessage('用户名长度必须在1-50个字符之间'),
            (0, express_validator_1.body)('message')
                .isLength({ min: 1, max: 1000 })
                .withMessage('消息长度必须在1-1000个字符之间'),
            (0, express_validator_1.body)('messageType')
                .optional()
                .isIn(['text', 'image', 'emoji'])
                .withMessage('消息类型必须是 text、image 或 emoji'),
        ];
    }
    static uuidParam(paramName = 'id') {
        return (0, express_validator_1.param)(paramName)
            .isUUID()
            .withMessage(`${paramName} 必须是有效的UUID格式`);
    }
    static internalCodeParam() {
        return (0, express_validator_1.param)('internalCode')
            .matches(/^[a-zA-Z0-9_-]+$/)
            .withMessage('内部代码格式不正确');
    }
    static paginationQuery() {
        return [
            (0, express_validator_1.query)('page')
                .optional()
                .isInt({ min: 1 })
                .withMessage('页码必须是正整数'),
            (0, express_validator_1.query)('limit')
                .optional()
                .isInt({ min: 1, max: 100 })
                .withMessage('每页数量必须在1-100之间'),
            (0, express_validator_1.query)('sortBy')
                .optional()
                .isString()
                .withMessage('排序字段必须是字符串'),
            (0, express_validator_1.query)('sortOrder')
                .optional()
                .isIn(['ASC', 'DESC'])
                .withMessage('排序方向必须是 ASC 或 DESC'),
        ];
    }
    static refreshToken() {
        return [
            (0, express_validator_1.body)('refreshToken')
                .notEmpty()
                .withMessage('刷新令牌不能为空'),
        ];
    }
}
exports.ValidationUtils = ValidationUtils;
exports.default = ValidationUtils;
//# sourceMappingURL=validation.js.map