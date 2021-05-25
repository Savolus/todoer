import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

import { configuration } from './config/configuration';

@Module({
	imports: [
		TypeOrmModule.forRoot(configuration),
		UsersModule,
		TodosModule
	],
	controllers: [ ],
	providers: [ ]
})

export class AppModule {}
