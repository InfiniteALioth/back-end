"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ChatMessage extends sequelize_1.Model {
}
ChatMessage.init({
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
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    username: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: [1, 50],
            notEmpty: true,
        },
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            len: [1, 1000],
            notEmpty: true,
        },
    },
    messageType: {
        type: sequelize_1.DataTypes.ENUM('text', 'image', 'emoji'),
        defaultValue: 'text',
        allowNull: false,
    },
    isDeleted: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
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
    modelName: 'ChatMessage',
    tableName: 'chat_messages',
    timestamps: true,
    indexes: [
        {
            fields: ['pageId'],
        },
        {
            fields: ['userId'],
        },
        {
            fields: ['isDeleted'],
        },
        {
            fields: ['createdAt'],
        },
    ],
});
exports.default = ChatMessage;
//# sourceMappingURL=ChatMessage.js.map