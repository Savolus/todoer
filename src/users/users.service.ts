import {
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt'

import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { IUser } from 'src/types/interfaces/users/user.interface';
import { User } from '../entities/user.entity';
import { UserRoleEnum } from 'src/types/enums/user-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async findAll(): Promise<IUser[]> {
        return await this.usersRepository.find({
            select: [ 'id', 'login', 'email', 'role' ]
        }) as IUser[]
    }

    async findOne(id: string): Promise<IUser> {
        return await this.usersRepository.findOne(id) as IUser
    }

    async findOneByLogin(login: string): Promise<IUser> {
        return await this.usersRepository.findOne({
            where: {
                login
            }
        }) as IUser
    }

    async create(userDto: RequestUserDto, isAdmin: boolean = false): Promise<IUser> {
        const tempUserLogin: User = await this.usersRepository.findOne({
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
        
        const user: User = {
            login: userDto.login,
            password: await hash(userDto.password, 10),
            email: userDto.email,
            role: isAdmin? userDto.role : UserRoleEnum.USER
        }

        const createdUser = await this.usersRepository.save(user)

        return {
            ...createdUser,
            password: undefined
        } as IUser
    }

    async update(
        id: string,
        userDto: RequestUserDto,
        isAdmin: boolean = false
    ): Promise<IUser> {
        const user = await this.usersRepository.findOne(id)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (user.login !== userDto.login) {
            const tempUserLogin = await this.usersRepository.findOne({
                where: {
                    login: userDto.login
                }
            })

            if (tempUserLogin) {
                throw new ConflictException('Login is already taken')
            }

            const tempUserEmail = await this.usersRepository.findOne({
                where: {
                    email: userDto.email
                }
            })

            if (tempUserEmail) {
                throw new ConflictException('Email is already taken')
            }
        }

        user.login = userDto.login
        user.password = await hash(userDto.password, 10)
        
        if (isAdmin) {
            user.role = userDto.role
        }

        const updatedUser = await this.usersRepository.save(user) as IUser

        return {
            ...updatedUser,
            password: undefined
        } as IUser
    }

    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id)
    }
}
