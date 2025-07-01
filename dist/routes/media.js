"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mediaController_1 = require("../controllers/mediaController");
const validation_1 = require("../utils/validation");
const validation_2 = require("../middleware/validation");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.post('/', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.mediaItemCreate(), validation_2.validate, mediaController_1.MediaController.createMediaItem);
router.get('/page/:pageId', middleware_1.optionalAuth, validation_1.ValidationUtils.uuidParam('pageId'), validation_1.ValidationUtils.paginationQuery(), validation_2.validate, mediaController_1.MediaController.getMediaItems);
router.put('/:id', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.uuidParam('id'), validation_2.validate, mediaController_1.MediaController.updateMediaItem);
router.delete('/:id', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.uuidParam('id'), validation_2.validate, mediaController_1.MediaController.deleteMediaItem);
router.put('/order/batch', middleware_1.authenticate, middleware_1.requireAdmin, mediaController_1.MediaController.updateItemsOrder);
exports.default = router;
//# sourceMappingURL=media.js.map