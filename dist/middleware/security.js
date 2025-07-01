"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ipWhitelist = exports.healthCheck = exports.requestLogger = exports.compressionConfig = exports.helmetConfig = exports.uploadRateLimit = exports.authRateLimit = exports.generalRateLimit = exports.createRateLimit = exports.corsOptions = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const config_1 = require("../config");
exports.corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = config_1.config.CORS_ORIGIN.split(',').map(o => o.trim());
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            callback(null, true);
        }
        else {
            callback(new Error('不允许的 CORS 来源'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
};
const createRateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        message: {
            success: false,
            message: '请求过于频繁，请稍后再试',
            timestamp: new Date().toISOString(),
        },
        standardHeaders: true,
        legacyHeaders: false,
        skip: (req) => {
            return req.path === '/health' || req.path.startsWith('/static');
        },
    });
};
exports.createRateLimit = createRateLimit;
exports.generalRateLimit = (0, exports.createRateLimit)(parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10));
exports.authRateLimit = (0, exports.createRateLimit)(15 * 60 * 1000, 5);
exports.uploadRateLimit = (0, exports.createRateLimit)(60 * 1000, 10);
exports.helmetConfig = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'", "https:"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
});
exports.compressionConfig = (0, compression_1.default)({
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression_1.default.filter(req, res);
    },
    level: 6,
    threshold: 1024,
});
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
        };
        if (res.statusCode >= 400) {
            console.error('HTTP Error:', logData);
        }
        else {
            console.log('HTTP Request:', logData);
        }
    });
    next();
};
exports.requestLogger = requestLogger;
const healthCheck = (req, res) => {
    res.status(200).json({
        success: true,
        message: '服务运行正常',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
    });
};
exports.healthCheck = healthCheck;
const ipWhitelist = (allowedIPs) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress;
        if (allowedIPs.length === 0 || allowedIPs.includes(clientIP || '')) {
            next();
        }
        else {
            res.status(403).json({
                success: false,
                message: 'IP 地址不在白名单中',
                timestamp: new Date().toISOString(),
            });
        }
    };
};
exports.ipWhitelist = ipWhitelist;
exports.default = {
    corsOptions: exports.corsOptions,
    createRateLimit: exports.createRateLimit,
    generalRateLimit: exports.generalRateLimit,
    authRateLimit: exports.authRateLimit,
    uploadRateLimit: exports.uploadRateLimit,
    helmetConfig: exports.helmetConfig,
    compressionConfig: exports.compressionConfig,
    requestLogger: exports.requestLogger,
    healthCheck: exports.healthCheck,
    ipWhitelist: exports.ipWhitelist,
};
//# sourceMappingURL=security.js.map