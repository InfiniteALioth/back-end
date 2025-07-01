import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IChatMessage } from '../types';

interface ChatMessageCreationAttributes extends Optional<IChatMessage, 'id' | 'userId' | 'messageType' | 'isDeleted' | 'createdAt' | 'updatedAt'> {}

class ChatMessage extends Model<IChatMessage, ChatMessageCreationAttributes> implements IChatMessage {
  public id!: string;
  public pageId!: string;
  public userId?: string;
  public username!: string;
  public message!: string;
  public messageType!: 'text' | 'image' | 'emoji';
  public isDeleted!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    pageId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'media_pages',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [1, 50],
        notEmpty: true,
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 1000],
        notEmpty: true,
      },
    },
    messageType: {
      type: DataTypes.ENUM('text', 'image', 'emoji'),
      defaultValue: 'text',
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
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
  }
);

export default ChatMessage;