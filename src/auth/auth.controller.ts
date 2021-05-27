import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiTags,
    ApiResponse,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiConflictResponse
} from '@nestjs/swagger'

import { ResponseLoginDto } from '../types/classes/auth/response-login.dto';
import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { IUser } from '../types/interfaces/users/user.interface';

import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @ApiResponse({
        status: 201,
        description: 'Register user',
        schema: {
            example: {
                "id": 5,
                "login": "Mari",
                "email": "some_cool_girl@gmail.com",
                "role": "user"
            }
        }
    })
    @ApiConflictResponse({
        description: 'User with this credetials already exists'
    })
    @ApiBody({
        type: RequestUserDto
    })
    @Post('register')
    register(@Body() userDto: RequestUserDto): Promise<IUser> {
        return this.authService.register(userDto)
    }

    @ApiResponse({
        status: 201,
        description: 'Login user by generating Bearer token for the next 12h',
        type: ResponseLoginDto
    })
    @ApiUnauthorizedResponse({
        description: 'Wrong user credentials'
    })
    @ApiConflictResponse({
        description: 'User with this credetials doesn\'t exist'
    })
    @ApiBody({
        type: RequestUserDto
    })
    @Post('login')
    login(@Body() userDto: RequestUserDto): Promise<ResponseLoginDto> {
        return this.authService.login(userDto)
    }
}
