import { Model, Optional } from 'sequelize';
import { IUser } from '../types';
interface UserCreationAttributes extends Optional<IUser, 'id' | 'avatar' | 'isActive' | 'lastLoginAt' | 'createdAt' | 'updatedAt'> {
}
declare class User extends Model<IUser, UserCreationAttributes> implements IUser {
    id: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    isActive: boolean;
    lastLoginAt?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map