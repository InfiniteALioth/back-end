"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const uploadService_1 = require("../services/uploadService");
const response_1 = require("../utils/response");
const types_1 = require("../types");
const errorHandler_1 = require("../middleware/errorHandler");
class UploadController {
}
exports.UploadController = UploadController;
_a = UploadController;
UploadController.uploadSingle = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    const { folder = 'uploads' } = req.body;
    if (!file) {
        throw new types_1.AppError('没有文件被上传', 400);
    }
    const result = await uploadService_1.UploadService.uploadSingleFile(file, folder);
    response_1.ResponseUtils.success(res, result, '文件上传成功');
});
UploadController.uploadMultiple = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const files = req.files;
    const { folder = 'uploads' } = req.body;
    if (!files || files.length === 0) {
        throw new types_1.AppError('没有文件被上传', 400);
    }
    const results = await uploadService_1.UploadService.uploadMultipleFiles(files, folder);
    response_1.ResponseUtils.success(res, results, '文件批量上传成功');
});
UploadController.uploadAvatar = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    if (!file) {
        throw new types_1.AppError('没有头像文件被上传', 400);
    }
    const avatarUrl = await uploadService_1.UploadService.uploadAvatar(file, req.user.id);
    response_1.ResponseUtils.success(res, { avatarUrl }, '头像上传成功');
});
UploadController.uploadMedia = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    const { pageId } = req.body;
    if (!file) {
        throw new types_1.AppError('没有媒体文件被上传', 400);
    }
    if (!pageId) {
        throw new types_1.AppError('页面ID不能为空', 400);
    }
    const result = await uploadService_1.UploadService.uploadMediaFile(file, pageId);
    response_1.ResponseUtils.success(res, result, '媒体文件上传成功');
});
UploadController.deleteFile = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { filename } = req.params;
    await uploadService_1.UploadService.deleteFile(filename);
    response_1.ResponseUtils.success(res, null, '文件删除成功');
});
UploadController.deleteMultipleFiles = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { filenames } = req.body;
    if (!Array.isArray(filenames) || filenames.length === 0) {
        throw new types_1.AppError('文件名列表不能为空', 400);
    }
    await uploadService_1.UploadService.deleteMultipleFiles(filenames);
    response_1.ResponseUtils.success(res, null, '文件批量删除成功');
});
UploadController.getSignedUrl = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { filename } = req.params;
    const { expires = 3600 } = req.query;
    const url = await uploadService_1.UploadService.getSignedUrl(filename, Number(expires));
    response_1.ResponseUtils.success(res, { url }, '获取文件签名URL成功');
});
UploadController.getFileInfo = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { filename } = req.params;
    const info = await uploadService_1.UploadService.getFileInfo(filename);
    response_1.ResponseUtils.success(res, info, '获取文件信息成功');
});
UploadController.checkFileExists = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { filename } = req.params;
    const exists = await uploadService_1.UploadService.fileExists(filename);
    response_1.ResponseUtils.success(res, { exists }, '文件存在性检查完成');
});
exports.default = UploadController;
//# sourceMappingURL=uploadController.js.map