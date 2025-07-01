import bcrypt from 'bcryptjs';
import { config } from '../config';

export class BcryptUtils {
  private static readonly SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);

  /**
   * 哈希密码
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * 验证密码
   */
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * 生成随机盐
   */
  static async generateSalt(): Promise<string> {
    return bcrypt.genSalt(this.SALT_ROUNDS);
  }
}

export default BcryptUtils;