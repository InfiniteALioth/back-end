"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const validation_1 = require("../utils/validation");
const validation_2 = require("../middleware/validation");
const middleware_1 = require("../middleware");
const router = (0, express_1.Router)();
router.get('/:pageId/messages', validation_1.ValidationUtils.uuidParam('pageId'), validation_1.ValidationUtils.paginationQuery(), validation_2.validate, chatController_1.ChatController.getMessages);
router.post('/:pageId/messages', middleware_1.optionalAuth, validation_1.ValidationUtils.uuidParam('pageId'), validation_1.ValidationUtils.chatMessageCreate(), validation_2.validate, chatController_1.ChatController.sendMessage);
router.delete('/messages/:id', middleware_1.authenticate, validation_1.ValidationUtils.uuidParam('id'), validation_2.validate, chatController_1.ChatController.deleteMessage);
router.get('/:pageId/stats', middleware_1.optionalAuth, validation_1.ValidationUtils.uuidParam('pageId'), validation_2.validate, chatController_1.ChatController.getChatStats);
router.delete('/:pageId/messages', middleware_1.authenticate, middleware_1.requireAdmin, validation_1.ValidationUtils.uuidParam('pageId'), validation_2.validate, chatController_1.ChatController.clearMessages);
exports.default = router;
//# sourceMappingURL=chat.js.map