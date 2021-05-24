import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, UpdateResult, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { hash } from 'bcrypt'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find()
    }

    findOne(id: string): Promise<User> {
        return this.usersRepository.findOne(id)
    }

    async create(userDto: CreateUserDto): Promise<InsertResult> {
        const user = new User()

        user.login = userDto.login
        user.password = await hash(userDto.password, 10)
        user.todos = []

        return await this.usersRepository.insert(user)
    }

    async update(id: string, userDto: UpdateUserDto): Promise<UpdateResult> {
        const user = new User()

        user.login = userDto.login
        user.password = await hash(userDto.password, 10)

        return await this.usersRepository.update(id, user)
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id)
    }
}
