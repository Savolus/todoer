import { EntitySchema } from "typeorm";
import { Todo } from "../entities/todo.entity";

export const TodoSchema = new EntitySchema<Todo>({
    name: 'Todo',
    target: Todo,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true
        },
        title: {
            type: String
        },
        content: {
            type: String
        },
        publish_date: {
            type: Number,
            default: Math.trunc(Date.now() / 1000)
        },
        expire: {
            type: Number
        }
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User'
        }
    }
})
