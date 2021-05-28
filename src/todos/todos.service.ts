import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { Todo } from '../entities/todo.entity';
import { User } from '../entities/user.entity';

import { UsersService } from '../users/users.service';
import { ResponseTodoDto } from 'src/types/classes/todos/response-todo.dto';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>,
        private usersService: UsersService
    ) {}

    async findAll(userId: string): Promise<ResponseTodoDto[]> {
        const todos = await this.todosRepository.find({
            relations: [ 'user' ],
            where: {
                user: {
                    id: userId
                }
            }
        })

        return todos.map((todo: Todo) => {
            return {
                ...todo,
                user: undefined
            } as ResponseTodoDto
        })
    }

    async findOne(
        userId: string,
        todoId: string
    ): Promise<ResponseTodoDto> {
        const todo = await this.todosRepository.findOne({
            relations: [ 'user' ],
            where: {
                user: {
                    id: userId
                },
                id: todoId
            }
        })

        if (!todo) {
            throw new NotFoundException('Todo not found')
        }

        return {
            ...todo,
            user: undefined
        } as ResponseTodoDto
    }

    async create(
        userId: string,
        requestTodoDto: RequestTodoDto
    ): Promise<ResponseTodoDto> {
        const user = await this.usersService.findOne(userId) as User
        const todo = new Todo()

        todo.title = requestTodoDto.title
        todo.description = requestTodoDto.description
        todo.publish_date = new Date()
        todo.estimate = new Date(requestTodoDto.estimate)
        todo.user = user

        const createdTodo = await this.todosRepository.save(todo)

        return {
            ...createdTodo,
            user: undefined
        } as ResponseTodoDto
    }

    async update(
        userId: string,
        todoId: string,
        requestTodoDto: RequestTodoDto
    ): Promise<ResponseTodoDto> {
        const todo = await this.todosRepository.findOne({
            relations: [ 'user' ],
            where: {
                user: {
                    id: userId
                },
                id: todoId
            }
        })

        if (!todo) {
            throw new NotFoundException('Todo not found')
        }

        todo.title = requestTodoDto.title
        todo.description = requestTodoDto.description
        todo.estimate = new Date(requestTodoDto.estimate)

        await this.todosRepository.save(todo)

        return {
            ...todo,
            user: undefined
        } as ResponseTodoDto
    }

    delete(todoId: string): void {
        this.todosRepository.delete(todoId)
    }
}
