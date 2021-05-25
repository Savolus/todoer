import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResponseTodoDto } from 'src/types/classes/todos/response-todo.dto';
import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { UsersService } from '../users/users.service';
import { Todo } from '../entities/todo.entity';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo) private todosRepository: Repository<Todo>,
        private usersService: UsersService
    ) {}

    async findAll(userId: number): Promise<ResponseTodoDto[]> {
        const todos = await this.todosRepository.find({
            relations: [ 'user' ],
            where: {
                user: {
                    id: userId
                }
            }
        })

        const responseTodos = todos.map((todo: Todo) => {
            const responseTodo: ResponseTodoDto = {
                title: todo.title,
                content: todo.content,
                publish_date: todo.publish_date,
                expire: todo.expire,
            }

            return responseTodo
        })

        return responseTodos
    }

    async create(requestTodoDto: RequestTodoDto): Promise<ResponseTodoDto> {
        const user = await this.usersService.findOneUser(requestTodoDto.userId.toString())
        
        if (!user) {
            throw new HttpException('User not found', 404)
        }

        const todo: Todo = {
            title: requestTodoDto.title,
            content: requestTodoDto.content,
            expire: requestTodoDto.expire,
            publish_date: Math.trunc(Date.now() / 1000),
            user
        }

        await this.todosRepository.insert(todo)

        const responseTodoDto: ResponseTodoDto = {
            title: todo.title,
            content: todo.content,
            publish_date: todo.publish_date,
            expire: todo.expire
        }

        return responseTodoDto
    }

    async remove(id: string): Promise<void> {
        await this.todosRepository.delete(id)
    }
}
