import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
export interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserCreate {
    username: string;
    email: string;
    password: string;
    avatar?: string;
}
export interface IUserUpdate {
    username?: string;
    email?: string;
    avatar?: string;
}
export interface IAdmin {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'super_admin' | 'admin';
    isActive: boolean;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAdminCreate {
    username: string;
    email: string;
    password: string;
    role: 'super_admin' | 'admin';
}
export interface IMediaPage {
    id: string;
    title: string;
    description?: string;
    internalCode: string;
    isPublic: boolean;
    isActive: boolean;
    createdBy: string;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IMediaPageCreate {
    title: string;
    description?: string;
    internalCode: string;
    isPublic?: boolean;
    createdBy: string;
}
export interface IMediaPageUpdate {
    title?: string;
    description?: string;
    isPublic?: boolean;
    isActive?: boolean;
}
export interface IMediaItem {
    id: string;
    pageId: string;
    title: string;
    description?: string;
    mediaType: 'image' | 'video' | 'audio';
    mediaUrl: string;
    thumbnailUrl?: string;
    fileSize: number;
    duration?: number;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IMediaItemCreate {
    pageId: string;
    title: string;
    description?: string;
    mediaType: 'image' | 'video' | 'audio';
    mediaUrl: string;
    thumbnailUrl?: string;
    fileSize: number;
    duration?: number;
    sortOrder?: number;
}
export interface IMediaItemUpdate {
    title?: string;
    description?: string;
    sortOrder?: number;
    isActive?: boolean;
}
export interface IChatMessage {
    id: string;
    pageId: string;
    userId?: string;
    username: string;
    message: string;
    messageType: 'text' | 'image' | 'emoji';
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IChatMessageCreate {
    pageId: string;
    userId?: string;
    username: string;
    message: string;
    messageType?: 'text' | 'image' | 'emoji';
}
export interface IJwtPayload extends JwtPayload {
    id: string;
    username: string;
    email: string;
    type: 'user' | 'admin';
    role?: string;
}
export interface ITokens {
    accessToken: string;
    refreshToken: string;
}
export interface IAuthRequest extends Request {
    user?: IJwtPayload;
}
export interface IApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    timestamp: string;
}
export interface IPaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
export interface IPaginationResult<T> {
    items: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}
export interface IUploadedFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    destination: string;
    filename: string;
    path: string;
    url?: string;
}
export interface IOSSUploadResult {
    name: string;
    url: string;
    res: {
        status: number;
        headers: any;
        size: number;
        rt: number;
    };
}
export interface IStats {
    totalUsers: number;
    totalPages: number;
    totalMediaItems: number;
    totalChatMessages: number;
    activePages: number;
    todayRegistrations: number;
    todayPageViews: number;
}
export interface ISocketUser {
    id: string;
    username: string;
    pageId: string;
}
export interface IChatSocketData {
    pageId: string;
    message: string;
    username: string;
    userId?: string;
    messageType?: 'text' | 'image' | 'emoji';
}
export declare class AppError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export interface IEnvConfig {
    NODE_ENV: string;
    PORT: number;
    API_VERSION: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES_IN: string;
    OSS_REGION: string;
    OSS_ACCESS_KEY_ID: string;
    OSS_ACCESS_KEY_SECRET: string;
    OSS_BUCKET: string;
    OSS_ENDPOINT: string;
    CORS_ORIGIN: string;
    MAX_FILE_SIZE: string;
    ALLOWED_FILE_TYPES: string;
}
//# sourceMappingURL=index.d.ts.map