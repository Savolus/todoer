import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodoSchema } from './todo.schema';

@Module({
	imports: [ TypeOrmModule.forFeature([ TodoSchema ]) ],
	providers: [ TodosService ],
	controllers: [ TodosController ],
	exports: [ TodosService ]
})

export class TodosModule {}
