"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class MediaPage extends sequelize_1.Model {
}
MediaPage.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
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
    internalCode: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            len: [3, 50],
            notEmpty: true,
            is: /^[a-zA-Z0-9_-]+$/,
        },
    },
    isPublic: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    createdBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'admins',
            key: 'id',
        },
    },
    viewCount: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
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
    modelName: 'MediaPage',
    tableName: 'media_pages',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['internalCode'],
        },
        {
            fields: ['isPublic'],
        },
        {
            fields: ['isActive'],
        },
        {
            fields: ['createdBy'],
        },
        {
            fields: ['createdAt'],
        },
        {
            fields: ['viewCount'],
        },
    ],
});
exports.default = MediaPage;
//# sourceMappingURL=MediaPage.js.map