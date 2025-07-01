import { Model, Optional } from 'sequelize';
import { IMediaPage } from '../types';
interface MediaPageCreationAttributes extends Optional<IMediaPage, 'id' | 'description' | 'isPublic' | 'isActive' | 'viewCount' | 'createdAt' | 'updatedAt'> {
}
declare class MediaPage extends Model<IMediaPage, MediaPageCreationAttributes> implements IMediaPage {
    id: string;
    title: string;
    description?: string;
    internalCode: string;
    isPublic: boolean;
    isActive: boolean;
    createdBy: string;
    viewCount: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default MediaPage;
//# sourceMappingURL=MediaPage.d.ts.map