import { Todo } from "src/entities/todo.entity";
import { EntitySchema } from "typeorm";
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
