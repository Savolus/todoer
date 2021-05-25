import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { ResponseUserDto } from '../types/classes/users/response-user.dto';

import { User } from '../entities/user.entity';
import { hash } from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async findAll(): Promise<ResponseUserDto[]> {
        const users = await this.usersRepository.find()

        const responseUsersDto: ResponseUserDto[] = users.map((user: User) => {
            const responseUserDto: ResponseUserDto = {
                id: user.id,
                login: user.login
            }

            return responseUserDto
        })

        return responseUsersDto
    }

    async findOne(id: string): Promise<ResponseUserDto> {
        const user = await this.usersRepository.findOne(id)

        if (!user) {
            throw new HttpException('User not found', 404)
        }

        const userDto: ResponseUserDto = {
            id: user.id,
            login: user.login
        }

        return userDto
    }

    async findOneUser(id: string): Promise<User> {
        const user = await this.usersRepository.findOne(id)

        if (!user) {
            throw new HttpException('User not found', 404)
        }

        return user
    }

    async create(requestUserDto: RequestUserDto): Promise<ResponseUserDto> {
        const tempUser = await this.usersRepository.findOne({
            where: {
                login: requestUserDto.login
            }
        })

        if (tempUser) {
            throw new HttpException('User already exists', 409)
        }
        
        const user: User = {
            login: requestUserDto.login,
            password: await hash(requestUserDto.password, 10),
            todos: []
        }

        this.usersRepository.insert(user)

        const responseUserDto: ResponseUserDto = {
            id: user.id,
            login: user.login
        }

        return responseUserDto
    }

    async update(id: string, requestUserDto: RequestUserDto): Promise<ResponseUserDto> {
        const user = await this.usersRepository.findOne(id)

        if (!user) {
            throw new HttpException('User not found', 404)
        }

        if (user.login !== requestUserDto.login) {
            const tempUser = await this.usersRepository.findOne({
                where: {
                    login: requestUserDto.login
                }
            })

            if (user.id !== tempUser.id) {
                throw new HttpException('User already exists', 409)
            }
        }

        user.login = requestUserDto.login
        user.password = await hash(requestUserDto.password, 10)

        this.usersRepository.save(user)

        const responseUserDto: ResponseUserDto = {
            id: user.id,
            login: user.login
        }

        return responseUserDto
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id)
    }
}
