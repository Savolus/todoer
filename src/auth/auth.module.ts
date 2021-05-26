import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { AdminAccessGuard } from 'src/guards/admin-access.guard';

@Module({
	imports: [
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET
		}),
		forwardRef(() => UsersModule)
	],
	providers: [ AuthService, JwtStrategy, JwtAuthGuard, AdminAccessGuard ],
	controllers: [ AuthController ],
	exports: [ AuthService, JwtModule ]
})

export class AuthModule {
}
