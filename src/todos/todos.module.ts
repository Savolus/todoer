import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TodoSchema } from '../schemes/todo.schema';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

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
