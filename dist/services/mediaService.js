"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const models_1 = require("../models");
const types_1 = require("../types");
const sequelize_1 = require("sequelize");
const logger_1 = __importDefault(require("../utils/logger"));
class MediaService {
    static async createMediaPage(pageData) {
        try {
            const existingPage = await models_1.MediaPage.findOne({
                where: { internalCode: pageData.internalCode }
            });
            if (existingPage) {
                throw new types_1.AppError('内部代码已存在', 409);
            }
            const page = await models_1.MediaPage.create(pageData);
            logger_1.default.info(`媒体页面创建成功: ${page.id}`);
            return page;
        }
        catch (error) {
            logger_1.default.error('媒体页面创建失败:', error);
            throw error;
        }
    }
    static async getMediaPages(query) {
        try {
            const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'DESC', search, isPublic, createdBy } = query;
            const offset = (page - 1) * limit;
            const whereClause = { isActive: true };
            if (search) {
                whereClause[sequelize_1.Op.or] = [
                    { title: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } },
                    { internalCode: { [sequelize_1.Op.like]: `%${search}%` } }
                ];
            }
            if (typeof isPublic === 'boolean') {
                whereClause.isPublic = isPublic;
            }
            if (createdBy) {
                whereClause.createdBy = createdBy;
            }
            const { count, rows } = await models_1.MediaPage.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: models_1.Admin,
                        as: 'creator',
                        attributes: ['id', 'username', 'email']
                    }
                ],
                order: [[sortBy, sortOrder]],
                limit,
                offset,
            });
            const totalPages = Math.ceil(count / limit);
            return {
                items: rows,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: count,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            };
        }
        catch (error) {
            logger_1.default.error('获取媒体页面列表失败:', error);
            throw error;
        }
    }
    static async getMediaPageById(id, includeItems = true) {
        try {
            const includeOptions = [
                {
                    model: models_1.Admin,
                    as: 'creator',
                    attributes: ['id', 'username', 'email']
                }
            ];
            if (includeItems) {
                includeOptions.push({
                    model: models_1.MediaItem,
                    as: 'mediaItems',
                    where: { isActive: true },
                    required: false,
                    order: [['sortOrder', 'ASC']]
                });
            }
            const page = await models_1.MediaPage.findOne({
                where: { id, isActive: true },
                include: includeOptions,
            });
            if (!page) {
                throw new types_1.AppError('媒体页面不存在', 404);
            }
            return page;
        }
        catch (error) {
            logger_1.default.error('获取媒体页面失败:', error);
            throw error;
        }
    }
    static async getMediaPageByCode(internalCode) {
        try {
            const page = await models_1.MediaPage.findOne({
                where: { internalCode, isActive: true, isPublic: true },
                include: [
                    {
                        model: models_1.MediaItem,
                        as: 'mediaItems',
                        where: { isActive: true },
                        required: false,
                        order: [['sortOrder', 'ASC']]
                    },
                    {
                        model: models_1.Admin,
                        as: 'creator',
                        attributes: ['id', 'username']
                    }
                ],
            });
            if (!page) {
                throw new types_1.AppError('媒体页面不存在或未公开', 404);
            }
            await page.increment('viewCount');
            return page;
        }
        catch (error) {
            logger_1.default.error('获取媒体页面失败:', error);
            throw error;
        }
    }
    static async updateMediaPage(id, updateData) {
        try {
            const page = await models_1.MediaPage.findOne({
                where: { id, isActive: true }
            });
            if (!page) {
                throw new types_1.AppError('媒体页面不存在', 404);
            }
            await page.update(updateData);
            logger_1.default.info(`媒体页面更新成功: ${id}`);
            return page;
        }
        catch (error) {
            logger_1.default.error('媒体页面更新失败:', error);
            throw error;
        }
    }
    static async deleteMediaPage(id) {
        try {
            const page = await models_1.MediaPage.findOne({
                where: { id, isActive: true }
            });
            if (!page) {
                throw new types_1.AppError('媒体页面不存在', 404);
            }
            await page.update({ isActive: false });
            await models_1.MediaItem.update({ isActive: false }, { where: { pageId: id } });
            logger_1.default.info(`媒体页面删除成功: ${id}`);
        }
        catch (error) {
            logger_1.default.error('媒体页面删除失败:', error);
            throw error;
        }
    }
    static async createMediaItem(itemData) {
        try {
            const page = await models_1.MediaPage.findOne({
                where: { id: itemData.pageId, isActive: true }
            });
            if (!page) {
                throw new types_1.AppError('媒体页面不存在', 404);
            }
            if (!itemData.sortOrder) {
                const maxSortOrder = await models_1.MediaItem.max('sortOrder', {
                    where: { pageId: itemData.pageId, isActive: true }
                });
                itemData.sortOrder = (maxSortOrder || 0) + 1;
            }
            const item = await models_1.MediaItem.create(itemData);
            logger_1.default.info(`媒体项创建成功: ${item.id}`);
            return item;
        }
        catch (error) {
            logger_1.default.error('媒体项创建失败:', error);
            throw error;
        }
    }
    static async getMediaItems(pageId, query) {
        try {
            const { page = 1, limit = 10, sortBy = 'sortOrder', sortOrder = 'ASC' } = query;
            const offset = (page - 1) * limit;
            const { count, rows } = await models_1.MediaItem.findAndCountAll({
                where: { pageId, isActive: true },
                order: [[sortBy, sortOrder]],
                limit,
                offset,
            });
            const totalPages = Math.ceil(count / limit);
            return {
                items: rows,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: count,
                    itemsPerPage: limit,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            };
        }
        catch (error) {
            logger_1.default.error('获取媒体项列表失败:', error);
            throw error;
        }
    }
    static async updateMediaItem(id, updateData) {
        try {
            const item = await models_1.MediaItem.findOne({
                where: { id, isActive: true }
            });
            if (!item) {
                throw new types_1.AppError('媒体项不存在', 404);
            }
            await item.update(updateData);
            logger_1.default.info(`媒体项更新成功: ${id}`);
            return item;
        }
        catch (error) {
            logger_1.default.error('媒体项更新失败:', error);
            throw error;
        }
    }
    static async deleteMediaItem(id) {
        try {
            const item = await models_1.MediaItem.findOne({
                where: { id, isActive: true }
            });
            if (!item) {
                throw new types_1.AppError('媒体项不存在', 404);
            }
            await item.update({ isActive: false });
            logger_1.default.info(`媒体项删除成功: ${id}`);
        }
        catch (error) {
            logger_1.default.error('媒体项删除失败:', error);
            throw error;
        }
    }
    static async updateMediaItemsOrder(items) {
        try {
            const updatePromises = items.map(item => models_1.MediaItem.update({ sortOrder: item.sortOrder }, { where: { id: item.id, isActive: true } }));
            await Promise.all(updatePromises);
            logger_1.default.info('媒体项排序更新成功');
        }
        catch (error) {
            logger_1.default.error('媒体项排序更新失败:', error);
            throw error;
        }
    }
}
exports.MediaService = MediaService;
exports.default = MediaService;
//# sourceMappingURL=mediaService.js.map