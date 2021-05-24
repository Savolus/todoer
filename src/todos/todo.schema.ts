import { EntitySchema } from "typeorm";
import { Todo } from "./todo.entity";

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
            default: Date.now() / 1000
        },
        estimate: {
            type: Number
        }
    }
})
