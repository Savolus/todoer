import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

import { configuration } from './config/configuration';
import { AuthModule } from './auth/auth.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(configuration),
		UsersModule,
		TodosModule,
		AuthModule
	],
	controllers: [ ],
	providers: [ ],
	exports: [ ]
})

export class AppModule {}
