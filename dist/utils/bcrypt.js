"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptUtils = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class BcryptUtils {
    static async hashPassword(password) {
        return bcryptjs_1.default.hash(password, this.SALT_ROUNDS);
    }
    static async comparePassword(password, hashedPassword) {
        return bcryptjs_1.default.compare(password, hashedPassword);
    }
    static async generateSalt() {
        return bcryptjs_1.default.genSalt(this.SALT_ROUNDS);
    }
}
exports.BcryptUtils = BcryptUtils;
BcryptUtils.SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
exports.default = BcryptUtils;
//# sourceMappingURL=bcrypt.js.map