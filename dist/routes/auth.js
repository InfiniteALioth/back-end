"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../utils/validation");
const validation_2 = require("../middleware/validation");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post('/register', middleware_1.authRateLimit, validation_1.ValidationUtils.userRegister(), validation_2.validate, authController_1.AuthController.register);
router.post('/login', middleware_1.authRateLimit, validation_1.ValidationUtils.userLogin(), validation_2.validate, authController_1.AuthController.login);
router.post('/admin/login', middleware_1.authRateLimit, validation_1.ValidationUtils.adminLogin(), validation_2.validate, authController_1.AuthController.adminLogin);
router.post('/refresh', validation_1.ValidationUtils.refreshToken(), validation_2.validate, authController_1.AuthController.refreshToken);
router.get('/me', middleware_1.authenticate, authController_1.AuthController.getCurrentUser);
router.put('/change-password', middleware_1.authenticate, [
    validation_1.ValidationUtils.userLogin()[1],
    validation_1.ValidationUtils.userRegister()[2],
], validation_2.validate, authController_1.AuthController.changePassword);
router.post('/logout', middleware_1.authenticate, authController_1.AuthController.logout);
router.get('/validate', middleware_1.authenticate, authController_1.AuthController.validateToken);
exports.default = router;
//# sourceMappingURL=auth.js.map