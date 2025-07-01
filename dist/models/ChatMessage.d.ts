import { Model, Optional } from 'sequelize';
import { IChatMessage } from '../types';
interface ChatMessageCreationAttributes extends Optional<IChatMessage, 'id' | 'userId' | 'messageType' | 'isDeleted' | 'createdAt' | 'updatedAt'> {
}
declare class ChatMessage extends Model<IChatMessage, ChatMessageCreationAttributes> implements IChatMessage {
    id: string;
    pageId: string;
    userId?: string;
    username: string;
    message: string;
    messageType: 'text' | 'image' | 'emoji';
    isDeleted: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default ChatMessage;
//# sourceMappingURL=ChatMessage.d.ts.map