import { BadRequestException, Body, Controller, Get, HttpException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { TodosService } from './todos.service';
import { ITodo } from 'src/types/interfaces/todos/todo.interface';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Request } from 'express';
import { IUser } from 'src/types/interfaces/users/user.interface';

@UseGuards(JwtAuthGuard)
@Controller('api/todos')
export class TodosController {
    constructor(
        private readonly todosService: TodosService
    ) {}

    @Get()
    findAll(
        @Req() req: Request
    ): Promise<ITodo[]> {
        const user = req.user as IUser

        return this.todosService.findAll(user.id.toString())
    }

    @Get(':todoId')
    findOne(
        @Req() req: Request,
        @Param('todoId') todoId: string
    ): Promise<ITodo> {
        const user = req.user as IUser

        return this.todosService.findOne(user.id.toString(), todoId)
    }

    @Post()
    create(
        @Req() req: Request,
        @Body() todoDto: RequestTodoDto
    ): Promise<ITodo> {
        if (!todoDto.title || !todoDto.description || !todoDto.estimate) {
            throw new BadRequestException('Bad request')
        }

        const user = req.user as IUser

        return this.todosService.create(user.id.toString(), todoDto)
    }
}
