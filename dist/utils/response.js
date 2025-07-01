"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtils = void 0;
class ResponseUtils {
    static success(res, data, message = '操作成功', statusCode = 200) {
        const response = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };
        return res.status(statusCode).json(response);
    }
    static error(res, message = '操作失败', statusCode = 400, error) {
        const response = {
            success: false,
            message,
            error,
            timestamp: new Date().toISOString(),
        };
        return res.status(statusCode).json(response);
    }
    static paginated(res, result, message = '获取数据成功') {
        return this.success(res, result, message);
    }
    static created(res, data, message = '创建成功') {
        return this.success(res, data, message, 201);
    }
    static noContent(res) {
        return res.status(204).send();
    }
    static notFound(res, message = '资源未找到') {
        return this.error(res, message, 404);
    }
    static unauthorized(res, message = '未授权访问') {
        return this.error(res, message, 401);
    }
    static forbidden(res, message = '禁止访问') {
        return this.error(res, message, 403);
    }
    static validationError(res, errors, message = '数据验证失败') {
        return res.status(422).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString(),
        });
    }
    static serverError(res, message = '服务器内部错误', error) {
        return this.error(res, message, 500, error);
    }
}
exports.ResponseUtils = ResponseUtils;
exports.default = ResponseUtils;
//# sourceMappingURL=response.js.map