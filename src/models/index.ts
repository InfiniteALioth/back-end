import User from './User';
import Admin from './Admin';
import MediaPage from './MediaPage';
import MediaItem from './MediaItem';
import ChatMessage from './ChatMessage';

// 定义模型关联关系
const setupAssociations = () => {
  // Admin 和 MediaPage 的关联
  Admin.hasMany(MediaPage, {
    foreignKey: 'createdBy',
    as: 'mediaPages',
  });
  
  MediaPage.belongsTo(Admin, {
    foreignKey: 'createdBy',
    as: 'creator',
  });

  // MediaPage 和 MediaItem 的关联
  MediaPage.hasMany(MediaItem, {
    foreignKey: 'pageId',
    as: 'mediaItems',
  });
  
  MediaItem.belongsTo(MediaPage, {
    foreignKey: 'pageId',
    as: 'page',
  });

  // MediaPage 和 ChatMessage 的关联
  MediaPage.hasMany(ChatMessage, {
    foreignKey: 'pageId',
    as: 'chatMessages',
  });
  
  ChatMessage.belongsTo(MediaPage, {
    foreignKey: 'pageId',
    as: 'page',
  });

  // User 和 ChatMessage 的关联（可选）
  User.hasMany(ChatMessage, {
    foreignKey: 'userId',
    as: 'chatMessages',
  });
  
  ChatMessage.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

// 初始化关联关系
setupAssociations();

export {
  User,
  Admin,
  MediaPage,
  MediaItem,
  ChatMessage,
  setupAssociations,
};

export default {
  User,
  Admin,
  MediaPage,
  MediaItem,
  ChatMessage,
  setupAssociations,
};