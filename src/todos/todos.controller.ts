import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { TodosService } from './todos.service';
import { ResponseTodoDto } from 'src/types/classes/todos/response-todo.dto';

@Controller('api/users/:userId/todos')
export class TodosController {
    constructor(
        private readonly todosService: TodosService
    ) {}

    @Get()
    findAll(@Param('userId') userId: string): Promise<ResponseTodoDto[]> {
        return this.todosService.findAll(userId)
    }

    @Get(':todoId')
    findOne(@Param('userId') userId: string, @Param('todoId') todoId: string): Promise<ResponseTodoDto> {
        return this.todosService.findOne(userId, todoId)
    }

    @Post()
    create(@Body() todoDto: RequestTodoDto, @Param('userId') userId: string): Promise<ResponseTodoDto> {
        if (!todoDto.title || !todoDto.description || !todoDto.expire) {
            throw new HttpException('Bad request', 400) 
        }

        return this.todosService.create(userId, todoDto)
    }
}
