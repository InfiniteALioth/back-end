import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { IAdmin } from '../types';

interface AdminCreationAttributes extends Optional<IAdmin, 'id' | 'isActive' | 'lastLoginAt' | 'createdAt' | 'updatedAt'> {}

class Admin extends Model<IAdmin, AdminCreationAttributes> implements IAdmin {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'super_admin' | 'admin';
  public isActive!: boolean;
  public lastLoginAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [8, 255],
        notEmpty: true,
      },
    },
    role: {
      type: DataTypes.ENUM('super_admin', 'admin'),
      allowNull: false,
      defaultValue: 'admin',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    modelName: 'Admin',
    tableName: 'admins',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        unique: true,
        fields: ['username'],
      },
      {
        fields: ['role'],
      },
      {
        fields: ['isActive'],
      },
    ],
  }
);

export default Admin;