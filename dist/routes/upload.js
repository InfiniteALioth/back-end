"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const middleware_1 = require("../middleware");
const middleware_2 = require("../middleware");
const router = (0, express_1.Router)();
router.post('/single', middleware_2.authenticate, middleware_1.uploadRateLimit, (0, middleware_1.uploadSingle)('file'), uploadController_1.UploadController.uploadSingle);
router.post('/multiple', middleware_2.authenticate, middleware_1.uploadRateLimit, (0, middleware_1.uploadMultiple)('files', 10), uploadController_1.UploadController.uploadMultiple);
router.post('/avatar', middleware_2.authenticate, middleware_1.uploadRateLimit, (0, middleware_1.uploadSingle)('avatar'), uploadController_1.UploadController.uploadAvatar);
router.post('/media', middleware_2.authenticate, middleware_2.requireAdmin, middleware_1.uploadRateLimit, (0, middleware_1.uploadSingle)('media'), uploadController_1.UploadController.uploadMedia);
router.delete('/:filename', middleware_2.authenticate, middleware_2.requireAdmin, uploadController_1.UploadController.deleteFile);
router.delete('/', middleware_2.authenticate, middleware_2.requireAdmin, uploadController_1.UploadController.deleteMultipleFiles);
router.get('/:filename/signed-url', middleware_2.optionalAuth, uploadController_1.UploadController.getSignedUrl);
router.get('/:filename/info', middleware_2.optionalAuth, uploadController_1.UploadController.getFileInfo);
router.get('/:filename/exists', middleware_2.optionalAuth, uploadController_1.UploadController.checkFileExists);
exports.default = router;
//# sourceMappingURL=upload.js.map