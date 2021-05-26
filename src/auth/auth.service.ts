import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ResponseLoginDto } from 'src/types/classes/auth/response-login.dto';
import { RequestUserDto } from 'src/types/classes/users/request-user.dto';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/interfaces/users/user.interface';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    async validateUser(userDto: RequestUserDto) {
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

        return user
    }

    async register(userDto: RequestUserDto): Promise<IUser> {
        return this.usersService.create(userDto)
    }

    async login(requestUserDto: RequestUserDto): Promise<ResponseLoginDto> {
        const user = await this.validateUser(requestUserDto)

        return {
            token: await this.jwtService.sign({
                ...user,
                password: undefined
            } as IUser, { expiresIn: '12h' })
        } as ResponseLoginDto
    }
}
