import { Model, Optional } from 'sequelize';
import { IAdmin } from '../types';
interface AdminCreationAttributes extends Optional<IAdmin, 'id' | 'isActive' | 'lastLoginAt' | 'createdAt' | 'updatedAt'> {
}
declare class Admin extends Model<IAdmin, AdminCreationAttributes> implements IAdmin {
    id: string;
    username: string;
    email: string;
    password: string;
    role: 'super_admin' | 'admin';
    isActive: boolean;
    lastLoginAt?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Admin;
//# sourceMappingURL=Admin.d.ts.map