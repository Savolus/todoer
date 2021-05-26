import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

import { UserSchema } from '../schemes/user.schema'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
	imports: [ TypeOrmModule.forFeature([ UserSchema ]) ],
	providers: [ UsersService ],
	controllers: [ UsersController ],
	exports: [ UsersService ]
})

export class UsersModule {}
