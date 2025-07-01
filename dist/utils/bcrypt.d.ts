export declare class BcryptUtils {
    private static readonly SALT_ROUNDS;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    static generateSalt(): Promise<string>;
}
export default BcryptUtils;
//# sourceMappingURL=bcrypt.d.ts.map