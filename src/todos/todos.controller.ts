import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { Request } from 'express';

import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { IUser } from '../types/interfaces/users/user.interface';
import { ITodo } from '../types/interfaces/todos/todo.interface';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { TodosService } from './todos.service';

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
