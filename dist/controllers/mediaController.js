"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const mediaService_1 = require("../services/mediaService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
class MediaController {
}
exports.MediaController = MediaController;
_a = MediaController;
MediaController.createMediaItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pageId, title, description, mediaType, mediaUrl, thumbnailUrl, fileSize, duration, sortOrder, } = req.body;
    const item = await mediaService_1.MediaService.createMediaItem({
        pageId,
        title,
        description,
        mediaType,
        mediaUrl,
        thumbnailUrl,
        fileSize,
        duration,
        sortOrder,
    });
    response_1.ResponseUtils.created(res, item, '媒体项创建成功');
});
MediaController.getMediaItems = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { pageId } = req.params;
    const { page = 1, limit = 10, sortBy = 'sortOrder', sortOrder = 'ASC', } = req.query;
    const result = await mediaService_1.MediaService.getMediaItems(pageId, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy,
        sortOrder: sortOrder,
    });
    response_1.ResponseUtils.paginated(res, result, '获取媒体项列表成功');
});
MediaController.updateMediaItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { title, description, sortOrder, isActive } = req.body;
    const item = await mediaService_1.MediaService.updateMediaItem(id, {
        title,
        description,
        sortOrder,
        isActive,
    });
    response_1.ResponseUtils.success(res, item, '媒体项更新成功');
});
MediaController.deleteMediaItem = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await mediaService_1.MediaService.deleteMediaItem(id);
    response_1.ResponseUtils.success(res, null, '媒体项删除成功');
});
MediaController.updateItemsOrder = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { items } = req.body;
    if (!Array.isArray(items)) {
        return response_1.ResponseUtils.error(res, '参数格式错误', 400);
    }
    await mediaService_1.MediaService.updateMediaItemsOrder(items);
    response_1.ResponseUtils.success(res, null, '媒体项排序更新成功');
});
exports.default = MediaController;
//# sourceMappingURL=mediaController.js.map