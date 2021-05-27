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
import {
    ApiTags,
    ApiSecurity,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiUnauthorizedResponse
} from '@nestjs/swagger'
import { Request } from 'express';

import { RequestTodoDto } from '../types/classes/todos/request-todo.dto';
import { IUser } from '../types/interfaces/users/user.interface';
import { ITodo } from '../types/interfaces/todos/todo.interface';

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
        description: 'Get all user\'s todos',
        isArray: true,
        schema: {
            example: [
                {
                  "id": 1,
                  "title": "Buy water",
                  "description": "Go to the atb and buy water",
                  "publish_date": "2021-05-27T09:20:56.000Z",
                  "estimate": "2021-06-27T04:25:55.000Z"
                },
                {
                  "id": 2,
                  "title": "Buy butter",
                  "description": "Go to the atb and buy butter",
                  "publish_date": "2021-05-27T09:24:14.000Z",
                  "estimate": "2021-06-27T04:25:55.000Z"
                }
              ]
        }
    })
    @Get()
    findAll(
        @Req() req: Request
    ): Promise<ITodo[]> {
        const user = req.user as IUser

        return this.todosService.findAll(user.id.toString())
    }

    @ApiResponse({
        status: 200,
        description: 'Get user\'s todo by id',
        schema: {
            example: {
                "id": 2,
                "title": "Buy butter",
                "description": "Go to the atb and buy butter",
                "publish_date": "2021-05-27T09:20:56.000Z",
                "estimate": "2021-06-27T04:25:55.000Z"
            }
        }
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
    ): Promise<ITodo> {
        const user = req.user as IUser

        return this.todosService.findOne(user.id.toString(), id)
    }

    @ApiResponse({
        status: 201,
        description: 'Create todo',
        schema: {
            example: {
                "id": 3,
                "title": "Buy chocolate",
                "description": "Go to the atb and buy chocolate",
                "publish_date": "2021-05-27T09:20:56.000Z",
                "estimate": "2021-06-27T04:25:55.000Z"
            }
        }
    })
    @ApiBody({
        type: RequestTodoDto
    })
    @Post()
    create(
        @Req() req: Request,
        @Body() todoDto: RequestTodoDto
    ): Promise<ITodo> {
        const user = req.user as IUser

        return this.todosService.create(user.id.toString(), todoDto)
    }

    @ApiResponse({
        status: 201,
        description: 'Update todo by id',
        schema: {
            example: {
                "id": 3,
                "title": "Buy chocolate",
                "description": "Go to the atb and buy chocolate",
                "publish_date": "2021-05-27T09:20:56.000Z",
                "estimate": "2021-06-27T04:25:55.000Z"
            }
        }
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
    ): Promise<ITodo> {
        const user = req.user as IUser

        return this.todosService.update(
            user.id.toString(),
            id,
            todoDto
        )
    }

    @ApiResponse({
        status: 200,
        description: 'Delete todo by id'
    })
    @ApiParam({
        name: 'id',
        type: String,
        example: '3'
    })
    @Delete(':id')
    delete(
        @Req() req: Request,
        @Param('id') id: string
    ): void {
        const user = req.user as IUser

        this.todosService.delete(user.id.toString(), id)
    }
}
