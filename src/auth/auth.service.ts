import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { ResponseLoginDto } from '../types/classes/auth/response-login.dto';
import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { IUser } from '../types/interfaces/users/user.interface';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async register(userDto: RequestUserDto): Promise<IUser> {
        return this.usersService.create(userDto)
    }

    async login(userDto: RequestUserDto): Promise<ResponseLoginDto> {
        const user: IUser = await this.usersService.findOneByLogin(userDto.login)

        if (!user) {
            throw new UnauthorizedException('User dosn\'t exist')
        }
        if (user.login !== userDto.login) {
            throw new UnauthorizedException('Invalid login')
        }
        if (user.email !== userDto.email) {
            throw new UnauthorizedException('Invalid email')
        }
        if (!(await compare(userDto.password, user.password))) {
            throw new UnauthorizedException('Invalid password')
        }

        return {
            token: await this.jwtService.sign({
                ...user,
                password: undefined
            } as IUser, {
                expiresIn: '12h'
            })
        } as ResponseLoginDto
    }
}
