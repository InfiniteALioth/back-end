"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const validation_1 = require("../utils/validation");
const validation_2 = require("../middleware/validation");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post('/admins', middleware_1.authenticate, middleware_1.requireSuperAdmin, validation_1.ValidationUtils.adminCreate(), validation_2.validate, adminController_1.AdminController.createAdmin);
router.get('/admins', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.paginationQuery(), validation_2.validate, adminController_1.AdminController.getAdmins);
router.get('/users', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.paginationQuery(), validation_2.validate, adminController_1.AdminController.getUsers);
router.put('/users/:id/status', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.uuidParam('id'), validation_2.validate, adminController_1.AdminController.updateUserStatus);
router.put('/admins/:id/status', middleware_1.authenticate, middleware_1.requireSuperAdmin, validation_1.ValidationUtils.uuidParam('id'), validation_2.validate, adminController_1.AdminController.updateAdminStatus);
router.get('/stats', middleware_1.authenticate, middleware_1.requireAdmin, adminController_1.AdminController.getSystemStats);
router.get('/activity', middleware_1.authenticate, middleware_1.requireAdmin, adminController_1.AdminController.getRecentActivity);
router.get('/health', middleware_1.authenticate, middleware_1.requireAdmin, adminController_1.AdminController.healthCheck);
exports.default = router;
//# sourceMappingURL=admin.js.map