import { IJwtPayload, ITokens } from '../types';
export declare class JWTUtils {
    static generateAccessToken(payload: Omit<IJwtPayload, 'iat' | 'exp'>): string;
    static generateRefreshToken(payload: Omit<IJwtPayload, 'iat' | 'exp'>): string;
    static generateTokens(payload: Omit<IJwtPayload, 'iat' | 'exp'>): ITokens;
    static verifyAccessToken(token: string): IJwtPayload;
    static verifyRefreshToken(token: string): IJwtPayload;
    static extractTokenFromHeader(authHeader?: string): string;
    static decodeToken(token: string): IJwtPayload | null;
    static isTokenExpiringSoon(token: string): boolean;
}
export default JWTUtils;
//# sourceMappingURL=jwt.d.ts.map