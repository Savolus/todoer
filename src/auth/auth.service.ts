import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { ResponseUserDto } from '../types/classes/users/response-user.dto';
import { ResponseLoginDto } from '../types/classes/auth/response-login.dto';
import { RequestUserDto } from '../types/classes/users/request-user.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    register(userDto: RequestUserDto): Promise<ResponseUserDto> {
        return this.usersService.create(userDto)
    }

    async login(userDto: RequestUserDto): Promise<ResponseLoginDto> {
        const user = await this.usersService.findOneByCredentials(
            userDto.login,
            userDto.email
        )

        if (!(await compare(userDto.password, user.password))) {
            throw new UnauthorizedException('Wrong user\'s password')
        }

        return {
            token: await this.jwtService.sign({
                ...user,
                password: undefined
            } as ResponseUserDto, {
                expiresIn: '12h'
            })
        } as ResponseLoginDto
    }
}
