import { Injectable } from '@nestjs/common';
import { ResponseLoginDto } from 'src/types/classes/auth/response-login.dto';
import { RequestUserDto } from 'src/types/classes/users/request-user.dto';
import { ResponseUserDto } from 'src/types/classes/users/response-user.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtSwrvice: JwtService,
        private usersService: UsersService
    ) {}

    generateJWT(user: User): string {
        return this.jwtSwrvice.sign({
            id: user.id,
            login: user.login,
            email: user.email
        }, { expiresIn: '12h' })
    }

    verifyJWT(token: string) {
        return this.jwtSwrvice.verify(token)
    }

    register(userDto: RequestUserDto): Promise<ResponseUserDto> {
        return this.usersService.create(userDto)
    }

    async login(requestUserDto: RequestUserDto): Promise<ResponseLoginDto> {
        const user: User = await this.usersService.findOneUserDto(requestUserDto)

        const responseLoginDto: ResponseLoginDto = {
            id: user.id,
            login: user.login,
            email: user.email,
            token: this.generateJWT(user)
        }

        return responseLoginDto
    }
}
