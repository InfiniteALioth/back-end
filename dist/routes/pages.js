"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pageController_1 = require("../controllers/pageController");
const validation_1 = require("../utils/validation");
const validation_2 = require("../middleware/validation");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post('/', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.mediaPageCreate(), validation_2.validate, pageController_1.PageController.createPage);
router.get('/', middleware_1.optionalAuth, validation_1.ValidationUtils.paginationQuery(), validation_2.validate, pageController_1.PageController.getPages);
router.get('/my', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.paginationQuery(), validation_2.validate, pageController_1.PageController.getMyPages);
router.get('/code/:internalCode', validation_1.ValidationUtils.internalCodeParam(), validation_2.validate, pageController_1.PageController.getPageByCode);
router.get('/:id', middleware_1.optionalAuth, validation_1.ValidationUtils.uuidParam('id'), validation_2.validate, pageController_1.PageController.getPageById);
router.put('/:id', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.uuidParam('id'), validation_1.ValidationUtils.mediaPageUpdate(), validation_2.validate, pageController_1.PageController.updatePage);
router.delete('/:id', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.uuidParam('id'), validation_2.validate, pageController_1.PageController.deletePage);
exports.default = router;
//# sourceMappingURL=pages.js.map