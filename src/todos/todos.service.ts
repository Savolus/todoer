import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { ITodo } from '../types/interfaces/todos/todo.interface'
import { Todo } from '../entities/todo.entity';
import { User } from '../entities/user.entity';

import { UsersService } from '../users/users.service';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>,
        private usersService: UsersService
    ) {}

    async findAll(userId: string): Promise<ITodo[]> {
        const todos = await this.todosRepository.find()

        console.dir(
            await this.todosRepository
                .createQueryBuilder('todo')
                .getMany()
        )

        return todos.map((todo: Todo) => {
            return {
                ...todo,
                user: undefined
            } as ITodo
        })
    }

    async findOne(userId: string, todoId: string): Promise<ITodo> {
        const todo: Todo = await this.todosRepository.findOne({
            relations: [ 'user' ],
            where: {
                user: {
                    id: userId
                },
                id: todoId
            }
        })

        return {
            ...todo,
            user: undefined
        } as ITodo
    }

    async create(userId: string, requestTodoDto: RequestTodoDto): Promise<ITodo> {
        const user = await this.usersService.findOne(userId) as User
        
        if (!user) {
            throw new NotFoundException('User not found')
        }

        const todo: Todo = {
            title: requestTodoDto.title,
            description: requestTodoDto.description,
            estimate: new Date(requestTodoDto.estimate),
            publish_date: new Date(),
            user
        }

        const createdUser = await this.todosRepository.save(todo)

        return {
            ...createdUser,
            user: undefined
        } as ITodo
    }

    async remove(id: string): Promise<void> {
        await this.todosRepository.delete(id)
    }
}
