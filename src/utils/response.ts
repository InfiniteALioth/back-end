import { Response } from 'express';
import { IApiResponse, IPaginationResult } from '../types';

export class ResponseUtils {
  /**
   * 成功响应
   */
  static success<T>(
    res: Response,
    data?: T,
    message: string = '操作成功',
    statusCode: number = 200
  ): Response {
    const response: IApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * 错误响应
   */
  static error(
    res: Response,
    message: string = '操作失败',
    statusCode: number = 400,
    error?: string
  ): Response {
    const response: IApiResponse = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    };

    return res.status(statusCode).json(response);
  }

  /**
   * 分页响应
   */
  static paginated<T>(
    res: Response,
    result: IPaginationResult<T>,
    message: string = '获取数据成功'
  ): Response {
    return this.success(res, result, message);
  }

  /**
   * 创建成功响应
   */
  static created<T>(
    res: Response,
    data?: T,
    message: string = '创建成功'
  ): Response {
    return this.success(res, data, message, 201);
  }

  /**
   * 无内容响应
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * 未找到响应
   */
  static notFound(
    res: Response,
    message: string = '资源未找到'
  ): Response {
    return this.error(res, message, 404);
  }

  /**
   * 未授权响应
   */
  static unauthorized(
    res: Response,
    message: string = '未授权访问'
  ): Response {
    return this.error(res, message, 401);
  }

  /**
   * 禁止访问响应
   */
  static forbidden(
    res: Response,
    message: string = '禁止访问'
  ): Response {
    return this.error(res, message, 403);
  }

  /**
   * 验证错误响应
   */
  static validationError(
    res: Response,
    errors: any,
    message: string = '数据验证失败'
  ): Response {
    return res.status(422).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * 服务器错误响应
   */
  static serverError(
    res: Response,
    message: string = '服务器内部错误',
    error?: string
  ): Response {
    return this.error(res, message, 500, error);
  }
}

export default ResponseUtils;