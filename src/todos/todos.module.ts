import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodoSchema } from '../schemes/todo.schema';

import { UsersModule } from 'src/users/users.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([ TodoSchema ]),
		UsersModule
	],
	providers: [ TodosService ],
	controllers: [ TodosController ],
	exports: [ TodosService ]
})

export class TodosModule {}
