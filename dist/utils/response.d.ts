import { Response } from 'express';
import { IPaginationResult } from '../types';
export declare class ResponseUtils {
    static success<T>(res: Response, data?: T, message?: string, statusCode?: number): Response;
    static error(res: Response, message?: string, statusCode?: number, error?: string): Response;
    static paginated<T>(res: Response, result: IPaginationResult<T>, message?: string): Response;
    static created<T>(res: Response, data?: T, message?: string): Response;
    static noContent(res: Response): Response;
    static notFound(res: Response, message?: string): Response;
    static unauthorized(res: Response, message?: string): Response;
    static forbidden(res: Response, message?: string): Response;
    static validationError(res: Response, errors: any, message?: string): Response;
    static serverError(res: Response, message?: string, error?: string): Response;
}
export default ResponseUtils;
//# sourceMappingURL=response.d.ts.map