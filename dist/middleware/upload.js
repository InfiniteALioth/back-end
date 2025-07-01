"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateFileExtension = exports.generateFileName = exports.getFileType = exports.uploadAny = exports.uploadFields = exports.uploadMultiple = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../config");
const types_1 = require("../types");
const path_1 = __importDefault(require("path"));
const parseFileSize = (sizeStr) => {
    const units = {
        'B': 1,
        'KB': 1024,
        'MB': 1024 * 1024,
        'GB': 1024 * 1024 * 1024,
    };
    const match = sizeStr.match(/^(\d+(?:\.\d+)?)\s*([A-Z]+)$/i);
    if (!match) {
        throw new Error('无效的文件大小格式');
    }
    const [, size, unit] = match;
    const multiplier = units[unit.toUpperCase()];
    if (!multiplier) {
        throw new Error('不支持的文件大小单位');
    }
    return parseFloat(size) * multiplier;
};
const getAllowedMimeTypes = () => {
    return config_1.config.ALLOWED_FILE_TYPES.split(',').map(type => type.trim());
};
const fileFilter = (req, file, cb) => {
    const allowedTypes = getAllowedMimeTypes();
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new types_1.AppError(`不支持的文件类型: ${file.mimetype}`, 400));
    }
};
const storage = multer_1.default.memoryStorage();
const uploadConfig = {
    storage,
    fileFilter,
    limits: {
        fileSize: parseFileSize(config_1.config.MAX_FILE_SIZE),
        files: 10,
    },
};
const uploadSingle = (fieldName = 'file') => {
    return (0, multer_1.default)(uploadConfig).single(fieldName);
};
exports.uploadSingle = uploadSingle;
const uploadMultiple = (fieldName = 'files', maxCount = 10) => {
    return (0, multer_1.default)(uploadConfig).array(fieldName, maxCount);
};
exports.uploadMultiple = uploadMultiple;
const uploadFields = (fields) => {
    return (0, multer_1.default)(uploadConfig).fields(fields);
};
exports.uploadFields = uploadFields;
const uploadAny = () => {
    return (0, multer_1.default)(uploadConfig).any();
};
exports.uploadAny = uploadAny;
const getFileType = (mimetype) => {
    if (mimetype.startsWith('image/')) {
        return 'image';
    }
    else if (mimetype.startsWith('video/')) {
        return 'video';
    }
    else if (mimetype.startsWith('audio/')) {
        return 'audio';
    }
    else {
        return 'other';
    }
};
exports.getFileType = getFileType;
const generateFileName = (originalName) => {
    const ext = path_1.default.extname(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${random}${ext}`;
};
exports.generateFileName = generateFileName;
const validateFileExtension = (filename, allowedExtensions) => {
    const ext = path_1.default.extname(filename).toLowerCase();
    return allowedExtensions.includes(ext);
};
exports.validateFileExtension = validateFileExtension;
exports.default = {
    uploadSingle: exports.uploadSingle,
    uploadMultiple: exports.uploadMultiple,
    uploadFields: exports.uploadFields,
    uploadAny: exports.uploadAny,
    getFileType: exports.getFileType,
    generateFileName: exports.generateFileName,
    validateFileExtension: exports.validateFileExtension,
};
//# sourceMappingURL=upload.js.map