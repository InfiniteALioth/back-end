import { IMediaPageCreate, IMediaPageUpdate, IMediaItemCreate, IMediaItemUpdate, IPaginationQuery, IPaginationResult } from '../types';
export declare class MediaService {
    static createMediaPage(pageData: IMediaPageCreate): Promise<any>;
    static getMediaPages(query: IPaginationQuery & {
        search?: string;
        isPublic?: boolean;
        createdBy?: string;
    }): Promise<IPaginationResult<any>>;
    static getMediaPageById(id: string, includeItems?: boolean): Promise<any>;
    static getMediaPageByCode(internalCode: string): Promise<any>;
    static updateMediaPage(id: string, updateData: IMediaPageUpdate): Promise<any>;
    static deleteMediaPage(id: string): Promise<void>;
    static createMediaItem(itemData: IMediaItemCreate): Promise<any>;
    static getMediaItems(pageId: string, query: IPaginationQuery): Promise<IPaginationResult<any>>;
    static updateMediaItem(id: string, updateData: IMediaItemUpdate): Promise<any>;
    static deleteMediaItem(id: string): Promise<void>;
    static updateMediaItemsOrder(items: Array<{
        id: string;
        sortOrder: number;
    }>): Promise<void>;
}
export default MediaService;
//# sourceMappingURL=mediaService.d.ts.map