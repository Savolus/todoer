import { Body, Controller, Post } from '@nestjs/common';
import {
    ApiTags,
    ApiResponse,
    ApiBody,
    ApiUnauthorizedResponse,
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse
} from '@nestjs/swagger'
import { ResponseUserDto } from 'src/types/classes/users/response-user.dto';

import { ResponseLoginDto } from '../types/classes/auth/response-login.dto';
import { RequestUserDto } from '../types/classes/users/request-user.dto';

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
        type: ResponseUserDto
    })
    @ApiBadRequestResponse({
        description: 'Bad request is given. Follow the request scheme'
    })
    @ApiConflictResponse({
        description: 'User with this credetials already exists'
    })
    @ApiBody({
        type: RequestUserDto
    })
    @Post('register')
    register(
        @Body() userDto: RequestUserDto
    ): Promise<ResponseUserDto> {
        return this.authService.register(userDto)
    }

    @ApiResponse({
        status: 201,
        description: 'Login user by generating Bearer token for the next 12h',
        type: ResponseLoginDto
    })
    @ApiBadRequestResponse({
        description: 'Bad request is given. Follow the request scheme'
    })
    @ApiUnauthorizedResponse({
        description: 'Wrong user credentials'
    })
    @ApiNotFoundResponse({
        description: 'No user with this credentials'
    })
    @ApiConflictResponse({
        description: 'User with this credetials doesn\'t exist'
    })
    @ApiBody({
        type: RequestUserDto
    })
    @Post('login')
    login(
        @Body() userDto: RequestUserDto
    ): Promise<ResponseLoginDto> {
        return this.authService.login(userDto)
    }
}
