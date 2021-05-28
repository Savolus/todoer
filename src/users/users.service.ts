import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt'

import { ResponseUserDto } from '../types/classes/users/response-user.dto';
import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { UserRoleEnum } from '../types/enums/user-role.enum';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    findAll(): Promise<ResponseUserDto[]> {
        return this.usersRepository.find({
            select: [ 'id', 'login', 'email', 'role' ]
        }) as Promise<ResponseUserDto[]>
    }

    async findOne(id: string): Promise<ResponseUserDto> {
        const user = await this.usersRepository.findOne(id)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user as ResponseUserDto
    }

    async findOneByCredentials(
        login: string,
        email: string
    ): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: {
                login,
                email
            }
        })

        if (!user) {
            throw new UnauthorizedException('No user with this credentials')
        }

        return user
    }

    async create(
        userDto: RequestUserDto,
        isAdmin = false
    ): Promise<ResponseUserDto> {
        const tempUserLogin = await this.usersRepository.findOne({
            where: {
                login: userDto.login
            }
        })

        if (tempUserLogin) {
            throw new ConflictException('User with this login already exists')
        }

        const tempUserEmail: User = await this.usersRepository.findOne({
            where: {
                email: userDto.email
            }
        })

        if (tempUserEmail) {
            throw new ConflictException('User with this email already exists')
        }

        const user = new User()

        user.login = userDto.login
        user.password = await hash(userDto.password, 10)
        user.email = userDto.email

        if (isAdmin) {
            user.role = userDto.role ?? UserRoleEnum.USER
        }

        const createdUser = await this.usersRepository.save(user)

        return {
            ...createdUser,
            password: undefined
        } as ResponseUserDto
    }

    async update(
        id: string,
        userDto: RequestUserDto,
        isAdmin = false
    ): Promise<ResponseUserDto> {
        const user = await this.usersRepository.findOne(id)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (user.login !== userDto.login) {
            const tempUser = await this.usersRepository.findOne({
                where: {
                    login: userDto.login
                }
            })

            if (tempUser) {
                throw new ConflictException('Login is already taken')
            }
        }
        if (user.email !== userDto.email) {
            const tempUser = await this.usersRepository.findOne({
                where: {
                    email: userDto.email
                }
            })

            if (tempUser) {
                throw new ConflictException('Email is already taken')
            }
        }

        user.login = userDto.login
        user.password = await hash(userDto.password, 10)
        user.email = userDto.email
        
        if (isAdmin) {
            user.role = userDto.role ?? UserRoleEnum.USER
        }

        const updatedUser = await this.usersRepository.save(user)

        return {
            ...updatedUser,
            password: undefined
        } as ResponseUserDto
    }

    delete(id: string): void {
        this.usersRepository.delete(id)
    }
}
