import { ConflictException, HttpException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { ResponseUserDto } from '../types/classes/users/response-user.dto';

import { User } from '../entities/user.entity';
import { hash } from 'bcrypt'
import { validate } from 'email-validator';
import { IUser } from 'src/types/interfaces/users/user.interface';

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
        const user: IUser = await this.usersRepository.findOne(id) as IUser

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async findOneByLogin(login: string): Promise<IUser> {
        const user: IUser = await this.usersRepository.findOne({
            where: {
                login
            }
        }) as IUser

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async create(userDto: RequestUserDto): Promise<IUser> {
        if (!validate(userDto.email)) {
            throw new UnauthorizedException('Invalid email')
        }
        
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

        await this.usersRepository.insert(user)

        return await this.usersRepository.findOne({
            select: [ 'id', 'login', 'email', 'role' ],
            where: {
                login: userDto.login
            }
        }) as IUser
    }

    async update(id: string, userDto: RequestUserDto): Promise<IUser> {
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
        
        return await this.usersRepository.save(user) as IUser
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id)
    }
}
