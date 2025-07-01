import { Sequelize } from 'sequelize';
import { config } from './index';
import logger from '../utils/logger';

// Create a mock sequelize instance for development without database
const createMockSequelize = () => {
  logger.warn('Using mock database connection for development');
  return new Sequelize('sqlite::memory:');
};

// Create the real database connection
const createRealSequelize = () => {
  return new Sequelize({
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
};

// Determine which connection to use
const useMockDatabase = process.env.USE_MOCK_DB === 'true' || !config.DB_PASSWORD;
const sequelize = useMockDatabase ? createMockSequelize() : createRealSequelize();

export const connectDatabase = async (): Promise<void> => {
  try {
    if (useMockDatabase) {
      logger.info('Using mock database - skipping real database connection');
      return;
    }
    
    await sequelize.authenticate();
    logger.info('数据库连接成功');
    
    if (config.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      logger.info('数据库同步完成');
    }
  } catch (error) {
    logger.error('数据库连接失败:', error);
    logger.warn('继续启动服务，但数据库功能将不可用');
    // Don't exit process on database error to allow the API to start
  }
};

export default sequelize;