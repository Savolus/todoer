import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { config } from 'dotenv'

config()

export const SERVER_PORT = process.env.PORT

export const JWT_SECRET = process.env.JWT_SECRET

export const configuration: TypeOrmModuleOptions = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "entities": [ "dist/**/*.entity{.ts,.js}" ],
    "cli": {
        "entitiesDir": "src/entities/"
    },
    // "synchronize": true,
    "autoLoadEntities": true
}
