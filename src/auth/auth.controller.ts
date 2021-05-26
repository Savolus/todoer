import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ResponseLoginDto } from 'src/types/classes/auth/response-login.dto';
import { RequestUserDto } from 'src/types/classes/users/request-user.dto';
import { IUser } from 'src/types/interfaces/users/user.interface';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    register(@Body() userDto: RequestUserDto): Promise<IUser> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new HttpException('Bad request', 400) 
        }

        return this.authService.register(userDto)
    }

    @Post('login')
    login(@Body() userDto: RequestUserDto): Promise<ResponseLoginDto> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new HttpException('Bad request', 400)
        }

        return this.authService.login(userDto)
    }
}
