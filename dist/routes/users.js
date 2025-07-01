"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const response_1 = require("../utils/response");
const types_1 = require("../types");
const middleware_1 = require("../middleware");
const errorHandler_1 = require("../middleware/errorHandler");
const validation_1 = require("../utils/validation");
const validation_2 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.get('/profile', middleware_1.authenticate, middleware_1.requireUser, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await models_1.User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
    });
    if (!user) {
        throw new types_1.AppError('用户不存在', 404);
    }
    response_1.ResponseUtils.success(res, user, '获取用户信息成功');
}));
router.put('/profile', middleware_1.authenticate, middleware_1.requireUser, [
    validation_1.ValidationUtils.userRegister()[0],
    validation_1.ValidationUtils.userRegister()[1],
], validation_2.validate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { username, email, avatar } = req.body;
    const user = await models_1.User.findByPk(req.user.id);
    if (!user) {
        throw new types_1.AppError('用户不存在', 404);
    }
    if (username !== user.username) {
        const existingUser = await models_1.User.findOne({ where: { username } });
        if (existingUser) {
            throw new types_1.AppError('用户名已被使用', 409);
        }
    }
    if (email !== user.email) {
        const existingUser = await models_1.User.findOne({ where: { email } });
        if (existingUser) {
            throw new types_1.AppError('邮箱已被使用', 409);
        }
    }
    await user.update({ username, email, avatar });
    const updatedUser = user.toJSON();
    delete updatedUser.password;
    response_1.ResponseUtils.success(res, updatedUser, '用户信息更新成功');
}));
router.delete('/profile', middleware_1.authenticate, middleware_1.requireUser, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const user = await models_1.User.findByPk(req.user.id);
    if (!user) {
        throw new types_1.AppError('用户不存在', 404);
    }
    await user.update({ isActive: false });
    response_1.ResponseUtils.success(res, null, '账户删除成功');
}));
exports.default = router;
//# sourceMappingURL=users.js.map