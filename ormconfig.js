const dotenv = require('dotenv')

dotenv.config()

module.exports = {
    "type": "mysql",
    "host": process.env.DB_HOST,
    "username": process.env.DB_USER,
    "password": process.env.DB_PASSWORD,
    "database": process.env.DB_NAME,
    "entities": [ "dist/**/*.entity{.ts,.js}" ],
    "migrations": [ "src/migrations/**/*.migration{.ts,.js}" ],
    "seeds": [ "src/seeds/**/*{.ts,.js}" ],
    "cli": {
        "entitiesDir": "src/entities/",
        "migrationsDir": "src/migrations/"
    },
    "autoLoadEntities": true
}
