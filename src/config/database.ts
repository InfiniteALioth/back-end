import { Sequelize } from 'sequelize';
import { config } from './index';
import logger from '../utils/logger';

const sequelize = new Sequelize({
  host: config.DB_HOST,
  port: config.DB_PORT,
  database: config.DB_NAME,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  dialect: 'mysql',
  logging: config.NODE_ENV === 'development' ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
  timezone: '+08:00',
});

export const connectDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    
    if (config.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('数据库同步完成');
    }
  } catch (error) {
    logger.error('数据库连接失败:', error);
    process.exit(1);
  }
};

export default sequelize;