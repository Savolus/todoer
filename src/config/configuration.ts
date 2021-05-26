import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv'

import { Todo } from "../entities/todo.entity";
import { User } from "../entities/user.entity";

config()

export const configuration: TypeOrmModuleOptions = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "entities": [ User, Todo ],
    // "synchronize": true,
    "autoLoadEntities": true
}
