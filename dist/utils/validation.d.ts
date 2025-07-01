import { ValidationChain } from 'express-validator';
export declare class ValidationUtils {
    static userRegister(): ValidationChain[];
    static userLogin(): ValidationChain[];
    static adminLogin(): ValidationChain[];
    static adminCreate(): ValidationChain[];
    static mediaPageCreate(): ValidationChain[];
    static mediaPageUpdate(): ValidationChain[];
    static mediaItemCreate(): ValidationChain[];
    static chatMessageCreate(): ValidationChain[];
    static uuidParam(paramName?: string): ValidationChain;
    static internalCodeParam(): ValidationChain;
    static paginationQuery(): ValidationChain[];
    static refreshToken(): ValidationChain[];
}
export default ValidationUtils;
//# sourceMappingURL=validation.d.ts.map