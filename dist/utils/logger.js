"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const config_1 = require("../config");
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`;
}));
const logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'interactive-media-backend' },
    transports: [
        new winston_daily_rotate_file_1.default({
            filename: 'logs/error-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
            maxFiles: process.env.LOG_FILE_MAX_FILES || '14d',
            zippedArchive: true,
        }),
        new winston_daily_rotate_file_1.default({
            filename: 'logs/combined-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: process.env.LOG_FILE_MAX_SIZE || '20m',
            maxFiles: process.env.LOG_FILE_MAX_FILES || '14d',
            zippedArchive: true,
        }),
    ],
});
if (config_1.config.NODE_ENV === 'development') {
    logger.add(new winston_1.default.transports.Console({
        format: consoleFormat,
    }));
}
exports.default = logger;
//# sourceMappingURL=logger.js.map