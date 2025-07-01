"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class MediaItem extends sequelize_1.Model {
}
MediaItem.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    pageId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'media_pages',
            key: 'id',
        },
    },
    title: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [1, 100],
            notEmpty: true,
        },
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    mediaType: {
        type: sequelize_1.DataTypes.ENUM('image', 'video', 'audio'),
        allowNull: false,
    },
    mediaUrl: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            isUrl: true,
            notEmpty: true,
        },
    },
    thumbnailUrl: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        validate: {
            isUrl: true,
        },
    },
    fileSize: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
        validate: {
            min: 1,
        },
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 0,
        },
    },
    sortOrder: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'MediaItem',
    tableName: 'media_items',
    timestamps: true,
    indexes: [
        {
            fields: ['pageId'],
        },
        {
            fields: ['mediaType'],
        },
        {
            fields: ['isActive'],
        },
        {
            fields: ['sortOrder'],
        },
        {
            fields: ['createdAt'],
        },
    ],
});
exports.default = MediaItem;
//# sourceMappingURL=MediaItem.js.map