import {
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
import {
    ApiTags,
    ApiSecurity,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse
} from '@nestjs/swagger'
import { Request } from 'express';

import { ResponseTodoDto } from '../types/classes/todos/response-todo.dto';
import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { IUser } from '../types/interfaces/users/user.interface';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { TodosService } from './todos.service';

@ApiTags('Todos')
@ApiSecurity('user')
@ApiUnauthorizedResponse({
    description: 'Needs authorization using Bearer token'
})
@UseGuards(JwtAuthGuard)
@Controller('api/todos')
export class TodosController {
    constructor(
        private readonly todosService: TodosService
    ) {}

    @ApiResponse({
        status: 200,
        description: 'Returns all user\'s todos',
        isArray: true,
        type: ResponseTodoDto
    })
    @Get()
    findAll(
        @Req() req: Request
    ): Promise<ResponseTodoDto[]> {
        const user = req.user as IUser

        return this.todosService.findAll(user.id.toString())
    }

    @ApiResponse({
        status: 200,
        description: 'Returns user\'s todo by todo\'s id',
        type: ResponseTodoDto
    })
    @ApiNotFoundResponse({
        description: 'No todo with this id'
    })
    @ApiParam({
        name: 'id',
        type: String,
        example: '2'
    })
    @Get(':id')
    findOne(
        @Req() req: Request,
        @Param('id') id: string
    ): Promise<ResponseTodoDto> {
        const user = req.user as IUser

        return this.todosService.findOne(user.id.toString(), id)
    }

    @ApiResponse({
        status: 201,
        description: 'Creates todo',
        type: ResponseTodoDto
    })
    @ApiBadRequestResponse({
        description: 'Bad request is given. Follow the request scheme'
    })
    @ApiBody({
        type: RequestTodoDto
    })
    @Post()
    create(
        @Req() req: Request,
        @Body() todoDto: RequestTodoDto
    ): Promise<ResponseTodoDto> {
        const user = req.user as IUser

        return this.todosService.create(user.id.toString(), todoDto)
    }

    @ApiResponse({
        status: 201,
        description: 'Updates todo by id',
        type: ResponseTodoDto
    })
    @ApiBadRequestResponse({
        description: 'Bad request is given. Follow the request scheme'
    })
    @ApiNotFoundResponse({
        description: 'No todo with this id'
    })
    @ApiBody({
        type: RequestTodoDto
    })
    @ApiParam({
        name: 'id',
        type: String,
        example: '3'
    })
    @Put(':id')
    update(
        @Req() req: Request,
        @Body() todoDto: RequestTodoDto,
        @Param('id') id: string
    ): Promise<ResponseTodoDto> {
        const user = req.user as IUser

        return this.todosService.update(
            user.id.toString(),
            id,
            todoDto
        )
    }

    @ApiResponse({
        status: 200,
        description: 'Deletes todo by id'
    })
    @ApiParam({
        name: 'id',
        type: String,
        example: '3'
    })
    @Delete(':id')
    delete(@Param('id') id: string): void {
        this.todosService.delete(id)
    }
}
