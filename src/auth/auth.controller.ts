import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import { ResponseLoginDto } from '../types/classes/auth/response-login.dto';
import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { IUser } from '../types/interfaces/users/user.interface';

import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    register(@Body() userDto: RequestUserDto): Promise<IUser> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new BadRequestException('Bad request') 
        }

        return this.authService.register(userDto)
    }

    @Post('login')
    login(@Body() userDto: RequestUserDto): Promise<ResponseLoginDto> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new BadRequestException('Bad request')
        }

        return this.authService.login(userDto)
    }
}
