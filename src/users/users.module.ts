import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UserSchema } from './user.schema'

@Module({
	imports: [ TypeOrmModule.forFeature([ UserSchema ]) ],
	providers: [ UsersService ],
	controllers: [ UsersController ],
	exports: [ UsersService ]
})

export class UsersModule {}
