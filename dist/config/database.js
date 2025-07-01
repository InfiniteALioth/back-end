"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const sequelize_1 = require("sequelize");
const index_1 = require("./index");
const logger_1 = __importDefault(require("../utils/logger"));
const sequelize = new sequelize_1.Sequelize({
    host: index_1.config.DB_HOST,
    port: index_1.config.DB_PORT,
    database: index_1.config.DB_NAME,
    username: index_1.config.DB_USER,
    password: index_1.config.DB_PASSWORD,
    dialect: 'mysql',
    logging: index_1.config.NODE_ENV === 'development' ? (msg) => logger_1.default.debug(msg) : false,
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
const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger_1.default.info('数据库连接成功');
        if (index_1.config.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            logger_1.default.info('数据库同步完成');
        }
    }
    catch (error) {
        logger_1.default.error('数据库连接失败:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
exports.default = sequelize;
//# sourceMappingURL=database.js.map