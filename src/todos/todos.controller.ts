import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
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

    @Get(':id')
    findOne(
        @Req() req: Request,
        @Param('id') id: string
    ): Promise<ITodo> {
        const user = req.user as IUser

        return this.todosService.findOne(user.id.toString(), id)
    }

    @Post()
    create(
        @Req() req: Request,
        @Body() todoDto: RequestTodoDto
    ): Promise<ITodo> {
        const user = req.user as IUser

        return this.todosService.create(user.id.toString(), todoDto)
    }

    @Put(':id')
    update(
        @Req() req: Request,
        @Body() todoDto: RequestTodoDto,
        @Param('id') id: string
    ): Promise<ITodo> {
        const user = req.user as IUser

        return this.todosService.update(
            user.id.toString(),
            id,
            todoDto
        )
    }

    @Delete(':id')
    delete(
        @Req() req: Request,
        @Param('id') id: string
    ): void {
        const user = req.user as IUser

        this.todosService.delete(user.id.toString(), id)
    }
}
