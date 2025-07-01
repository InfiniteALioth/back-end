import { Model, Optional } from 'sequelize';
import { IMediaItem } from '../types';
interface MediaItemCreationAttributes extends Optional<IMediaItem, 'id' | 'description' | 'thumbnailUrl' | 'duration' | 'sortOrder' | 'isActive' | 'createdAt' | 'updatedAt'> {
}
declare class MediaItem extends Model<IMediaItem, MediaItemCreationAttributes> implements IMediaItem {
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
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default MediaItem;
//# sourceMappingURL=MediaItem.d.ts.map