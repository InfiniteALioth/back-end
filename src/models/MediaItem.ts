import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IMediaItem } from '../types';

interface MediaItemCreationAttributes extends Optional<IMediaItem, 'id' | 'description' | 'thumbnailUrl' | 'duration' | 'sortOrder' | 'isActive' | 'createdAt' | 'updatedAt'> {}

class MediaItem extends Model<IMediaItem, MediaItemCreationAttributes> implements IMediaItem {
  public id!: string;
  public pageId!: string;
  public title!: string;
  public description?: string;
  public mediaType!: 'image' | 'video' | 'audio';
  public mediaUrl!: string;
  public thumbnailUrl?: string;
  public fileSize!: number;
  public duration?: number;
  public sortOrder!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MediaItem.init(
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
        notEmpty: true,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mediaType: {
      type: DataTypes.ENUM('image', 'video', 'audio'),
      allowNull: false,
    },
    mediaUrl: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true,
        notEmpty: true,
      },
    },
    thumbnailUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
  }
);

export default MediaItem;