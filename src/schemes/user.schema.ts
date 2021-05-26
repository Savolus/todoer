import { EntitySchema } from "typeorm";

import { UserRoleEnum } from "../types/enums/user-role.enum";
import { User } from "../entities/user.entity";

export const UserSchema = new EntitySchema<User>({
    name: 'User',
    target: User,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        login: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        role: {
            type: 'enum',
            enum: UserRoleEnum,
            default: UserRoleEnum.USER
        }
    },
    relations: {
        todos: {
            type: 'one-to-many',
            target: 'Todo',
            onDelete: 'CASCADE'
        }
    }
})
