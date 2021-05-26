import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { UsersService } from '../users/users.service';
import { Todo } from '../entities/todo.entity';
import { ITodo } from '../types/interfaces/todos/todo.interface'
import { User } from 'src/entities/user.entity';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo) private todosRepository: Repository<Todo>,
        private usersService: UsersService
    ) {}

    async findAll(userId: string): Promise<ITodo[]> {
        const todos: Todo[] = await this.todosRepository.find({
            relations: [ 'user' ],
            select: [ 'id', 'title', 'description', 'publish_date', 'estimate' ],
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
                }
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
            throw new HttpException('User not found', 404)
        }

        const todo: Todo = {
            title: requestTodoDto.title,
            description: requestTodoDto.description,
            estimate: new Date(requestTodoDto.estimate),
            publish_date: new Date(),
            user
        }

        await this.todosRepository.insert(todo)

        

        return {
            ...await this.todosRepository.findOne({
                where: {
                    user
                }
            }), user:undefined
        } as ITodo
    }

    async remove(id: string): Promise<void> {
        await this.todosRepository.delete(id)
    }
}
