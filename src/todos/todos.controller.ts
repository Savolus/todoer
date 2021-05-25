import { Body, Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { TodosService } from './todos.service';
import { ResponseTodoDto } from 'src/types/classes/todos/response-todo.dto';

@Controller('api/todos')
export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Get(':userId')
    findAll(@Param('userId') userId: string): Promise<ResponseTodoDto[]> {
        return this.todosService.findAll(+userId)
    }

    @Post()
    create(@Body() todoDto: RequestTodoDto): Promise<ResponseTodoDto> {
        if (!todoDto.title || !todoDto.content || !todoDto.expire) {
            throw new HttpException('Bad request', 400) 
        }

        return this.todosService.create(todoDto)
    }
}
