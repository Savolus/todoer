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
        description: {
            type: String,
            length: 4096
        },
        publish_date: {
            type: 'datetime'
        },
        estimate: {
            type: 'datetime'
        }
    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User'
        }
    }
})
