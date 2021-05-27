import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
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

        const todo: Todo = {
            title: requestTodoDto.title,
            description: requestTodoDto.description,
            estimate: new Date(requestTodoDto.estimate),
            publish_date: new Date(),
            user
        }

        const createdTodo = await this.todosRepository.save(todo)

        return {
            ...createdTodo,
            user: undefined
        } as ITodo
    }

    async update(
        userId: string,
        todoId: string,
        requestTodoDto: RequestTodoDto
    ): Promise<ITodo> {
        const todo = await this.todosRepository.findOne({
            relations: [ 'user' ],
            where: {
                user: {
                    id: userId
                },
                id: todoId
            }
        })

        todo.title = requestTodoDto.title
        todo.description = requestTodoDto.description
        todo.estimate = new Date(requestTodoDto.estimate)

        await this.todosRepository.save(todo)

        return {
            ...todo,
            user: undefined
        } as ITodo
    }

    remove(userId: string, todoId: string): void {
        this.todosRepository.createQueryBuilder('todo')
            .delete()
            .from(Todo)
            .where('userId = :userId', { userId })
            .where('id = :todoId', { todoId })
            .execute()
    }
}
