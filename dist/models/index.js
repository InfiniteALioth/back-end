"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAssociations = exports.ChatMessage = exports.MediaItem = exports.MediaPage = exports.Admin = exports.User = void 0;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Admin_1 = __importDefault(require("./Admin"));
exports.Admin = Admin_1.default;
const MediaPage_1 = __importDefault(require("./MediaPage"));
exports.MediaPage = MediaPage_1.default;
const MediaItem_1 = __importDefault(require("./MediaItem"));
exports.MediaItem = MediaItem_1.default;
const ChatMessage_1 = __importDefault(require("./ChatMessage"));
exports.ChatMessage = ChatMessage_1.default;
const setupAssociations = () => {
    Admin_1.default.hasMany(MediaPage_1.default, {
        foreignKey: 'createdBy',
        as: 'mediaPages',
    });
    MediaPage_1.default.belongsTo(Admin_1.default, {
        foreignKey: 'createdBy',
        as: 'creator',
    });
    MediaPage_1.default.hasMany(MediaItem_1.default, {
        foreignKey: 'pageId',
        as: 'mediaItems',
    });
    MediaItem_1.default.belongsTo(MediaPage_1.default, {
        foreignKey: 'pageId',
        as: 'page',
    });
    MediaPage_1.default.hasMany(ChatMessage_1.default, {
        foreignKey: 'pageId',
        as: 'chatMessages',
    });
    ChatMessage_1.default.belongsTo(MediaPage_1.default, {
        foreignKey: 'pageId',
        as: 'page',
    });
    User_1.default.hasMany(ChatMessage_1.default, {
        foreignKey: 'userId',
        as: 'chatMessages',
    });
    ChatMessage_1.default.belongsTo(User_1.default, {
        foreignKey: 'userId',
        as: 'user',
    });
};
exports.setupAssociations = setupAssociations;
setupAssociations();
exports.default = {
    User: User_1.default,
    Admin: Admin_1.default,
    MediaPage: MediaPage_1.default,
    MediaItem: MediaItem_1.default,
    ChatMessage: ChatMessage_1.default,
    setupAssociations,
};
//# sourceMappingURL=index.js.map