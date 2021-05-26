import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';

import { AuthModule } from './auth/auth.module';
import { configuration } from './config/configuration';

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
