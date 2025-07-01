import { IUserCreate, IAdminCreate, ITokens } from '../types';
export declare class AuthService {
    static registerUser(userData: IUserCreate): Promise<{
        user: any;
        tokens: ITokens;
    }>;
    static loginUser(email: string, password: string): Promise<{
        user: any;
        tokens: ITokens;
    }>;
    static loginAdmin(email: string, password: string): Promise<{
        admin: any;
        tokens: ITokens;
    }>;
    static createAdmin(adminData: IAdminCreate): Promise<any>;
    static refreshTokens(refreshToken: string): Promise<ITokens>;
    static validateUser(userId: string, userType: 'user' | 'admin'): Promise<any>;
    static changePassword(userId: string, userType: 'user' | 'admin', oldPassword: string, newPassword: string): Promise<void>;
}
export default AuthService;
//# sourceMappingURL=authService.d.ts.map