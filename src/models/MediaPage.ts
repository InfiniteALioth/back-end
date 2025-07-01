import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IMediaPage } from '../types';

interface MediaPageCreationAttributes extends Optional<IMediaPage, 'id' | 'description' | 'isPublic' | 'isActive' | 'viewCount' | 'createdAt' | 'updatedAt'> {}

class MediaPage extends Model<IMediaPage, MediaPageCreationAttributes> implements IMediaPage {
  public id!: string;
  public title!: string;
  public description?: string;
  public internalCode!: string;
  public isPublic!: boolean;
  public isActive!: boolean;
  public createdBy!: string;
  public viewCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

MediaPage.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
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
    internalCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        notEmpty: true,
        is: /^[a-zA-Z0-9_-]+$/,
      },
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'admins',
        key: 'id',
      },
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
  }
);

export default MediaPage;