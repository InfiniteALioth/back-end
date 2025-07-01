"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageController = void 0;
const mediaService_1 = require("../services/mediaService");
const response_1 = require("../utils/response");
const errorHandler_1 = require("../middleware/errorHandler");
class PageController {
}
exports.PageController = PageController;
_a = PageController;
PageController.createPage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { title, description, internalCode, isPublic } = req.body;
    const page = await mediaService_1.MediaService.createMediaPage({
        title,
        description,
        internalCode,
        isPublic,
        createdBy: req.user.id,
    });
    response_1.ResponseUtils.created(res, page, '媒体页面创建成功');
});
PageController.getPages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search, isPublic, createdBy, } = req.query;
    const result = await mediaService_1.MediaService.getMediaPages({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: search,
        isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
        createdBy: createdBy,
    });
    response_1.ResponseUtils.paginated(res, result, '获取媒体页面列表成功');
});
PageController.getPageById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const includeItems = req.query.includeItems !== 'false';
    const page = await mediaService_1.MediaService.getMediaPageById(id, includeItems);
    response_1.ResponseUtils.success(res, page, '获取媒体页面成功');
});
PageController.getPageByCode = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { internalCode } = req.params;
    const page = await mediaService_1.MediaService.getMediaPageByCode(internalCode);
    response_1.ResponseUtils.success(res, page, '获取媒体页面成功');
});
PageController.updatePage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    const { title, description, isPublic, isActive } = req.body;
    const page = await mediaService_1.MediaService.updateMediaPage(id, {
        title,
        description,
        isPublic,
        isActive,
    });
    response_1.ResponseUtils.success(res, page, '媒体页面更新成功');
});
PageController.deletePage = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { id } = req.params;
    await mediaService_1.MediaService.deleteMediaPage(id);
    response_1.ResponseUtils.success(res, null, '媒体页面删除成功');
});
PageController.getMyPages = (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search, } = req.query;
    const result = await mediaService_1.MediaService.getMediaPages({
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy,
        sortOrder: sortOrder,
        search: search,
        createdBy: req.user.id,
    });
    response_1.ResponseUtils.paginated(res, result, '获取我的媒体页面成功');
});
exports.default = PageController;
//# sourceMappingURL=pageController.js.map