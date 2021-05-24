import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm'
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity'

import { TodosModule } from './todos/todos.module';
import { TodosController } from './todos/todos.controller';
import { Todo } from './todos/todo.entity';

@Module({
	imports: [
		TypeOrmModule.forRoot({
			"type": "mysql",
			"host": "localhost",
			"username": "root",
			"password": "Jsw26Mh13Qke",
			"database": "api_todos",
			"entities": [ User, Todo ],
			"synchronize": true,
			"autoLoadEntities": true
		}),
		UsersModule,
		TodosModule
	],
	controllers: [ AppController, UsersController, TodosController ],
	providers: [ AppService ]
})

export class AppModule {
	constructor(private connection: Connection) {}
}
