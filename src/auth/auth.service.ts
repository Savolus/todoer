import { HttpException, Injectable } from '@nestjs/common';
import { ResponseLoginDto } from 'src/types/classes/auth/response-login.dto';
import { RequestUserDto } from 'src/types/classes/users/request-user.dto';
import { ResponseUserDto } from 'src/types/classes/users/response-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/entities/user.entity';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async validateUser(requestUserDto: RequestUserDto) {
        const user: User = await this.usersService.findOneUserDto(requestUserDto)

        if (!user) {
            throw new HttpException('User dos\'t exist', 401)
        }
        if (user.login !== requestUserDto.login) {
            throw new HttpException('Invalid login', 401)
        }
        if (user.email !== requestUserDto.email) {
            throw new HttpException('Invalid email', 401)
        }
        if (!(await compare(requestUserDto.password, user.password))) {
            throw new HttpException('Invalid password', 401)
        }

        return user
    }

    async register(userDto: RequestUserDto): Promise<ResponseUserDto> {
        return this.usersService.create(userDto)
    }

    async login(requestUserDto: RequestUserDto): Promise<ResponseLoginDto> {
        const user = await this.validateUser(requestUserDto)

        const responseLoginDto: ResponseLoginDto = {
            token: await this.jwtService.sign({
                id: user.id,
                login: user.login,
                email: user.email
            }, { expiresIn: '12h' })
        }

        return responseLoginDto
    }
}
