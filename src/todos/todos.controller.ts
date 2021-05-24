import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { Todo } from './todo.entity';
import { TodosService } from './todos.service';

@Controller('api/todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Get(':user_id')
    async findAll(@Param('user_id') user_id: string): Promise<Todo[]> {
        return this.todosService.findAll(+user_id)
    }

    @Post()
    async create(@Body() todoDto: CreateTodoDto): Promise<void> {
        if (!todoDto.title || !todoDto.content || !todoDto.estimate) {
            throw new HttpException('Bad request', 400) 
        }

        await this.todosService.create(todoDto)
    }
}
