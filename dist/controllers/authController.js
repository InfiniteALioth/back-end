"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
class AuthController {
}
exports.AuthController = AuthController;
_a = AuthController;
AuthController.register = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { username, email, password, avatar } = req.body;
    const result = await authService_1.AuthService.registerUser({
        username,
        email,
        password,
        avatar,
    });
    response_1.ResponseUtils.created(res, result, '注册成功');
});
AuthController.login = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService_1.AuthService.loginUser(email, password);
    response_1.ResponseUtils.success(res, result, '登录成功');
});
AuthController.adminLogin = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService_1.AuthService.loginAdmin(email, password);
    response_1.ResponseUtils.success(res, result, '管理员登录成功');
});
AuthController.refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await authService_1.AuthService.refreshTokens(refreshToken);
    response_1.ResponseUtils.success(res, tokens, '令牌刷新成功');
});
AuthController.getCurrentUser = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await authService_1.AuthService.validateUser(req.user.id, req.user.type);
    const userResponse = user.toJSON();
    delete userResponse.password;
    response_1.ResponseUtils.success(res, userResponse, '获取用户信息成功');
});
AuthController.changePassword = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    await authService_1.AuthService.changePassword(req.user.id, req.user.type, oldPassword, newPassword);
    response_1.ResponseUtils.success(res, null, '密码修改成功');
});
AuthController.logout = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    response_1.ResponseUtils.success(res, null, '登出成功');
});
AuthController.validateToken = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    response_1.ResponseUtils.success(res, {
        valid: true,
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            type: req.user.type,
            role: req.user.role,
        },
    }, '令牌有效');
});
exports.default = AuthController;
//# sourceMappingURL=authController.js.map