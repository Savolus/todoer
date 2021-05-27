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

    async create(userDto: RequestUserDto): Promise<IUser> {
        const tempUser: User = await this.usersRepository.findOne({
            where: {
                login: userDto.login
            }
        })

        if (tempUser) {
            throw new ConflictException('User already exists')
        }
        
        const user: User = {
            login: userDto.login,
            password: await hash(userDto.password, 10),
            email: userDto.email,
            role: userDto.role
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
            const tempUser = await this.usersRepository.findOne({
                where: {
                    login: userDto.login
                }
            })

            if (tempUser) {
                throw new ConflictException('User already exists')
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
