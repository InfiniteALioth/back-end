"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const response_1 = require("../utils/response");
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = errors.array().map(error => ({
            field: error.type === 'field' ? error.path : error.type,
            message: error.msg,
            value: error.type === 'field' ? error.value : undefined,
        }));
        response_1.ResponseUtils.validationError(res, formattedErrors);
        return;
    }
    next();
};
exports.validate = validate;
exports.default = exports.validate;
//# sourceMappingURL=validation.js.map