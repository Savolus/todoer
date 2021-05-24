import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { getRepository, InsertResult, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.entity';

@Injectable()
export class TodosService {
    constructor(
        @InjectRepository(Todo)
        private todosRepository: Repository<Todo>
    ) {}

    findAll(user_id: number): Promise<Todo[]> {
        return this.todosRepository.find({
            relations: [ 'user' ],
            where: {
                user: {
                    id: user_id
                }
            }
        })
    }

    async create(todoDto: CreateTodoDto): Promise<InsertResult> {
        const usersService = new UsersService(getRepository('User'))

        const user = await usersService.findOne(todoDto.user_id.toString())
        const todo = new Todo()

        todo.title = todoDto.title
        todo.content = todoDto.content
        todo.estimate = todoDto.estimate
        todo.user = user

        return this.todosRepository.insert(todo)
    }

    async remove(id: string): Promise<void> {
        await this.todosRepository.delete(id)
    }
}
