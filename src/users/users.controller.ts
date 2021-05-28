import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    Put,
    Delete,
    UseGuards,
    Req
} from '@nestjs/common';
import {
    ApiTags,
    ApiSecurity,
    ApiResponse,
    ApiBody,
    ApiParam,
    ApiUnauthorizedResponse,
    ApiForbiddenResponse,
    ApiConflictResponse,
    ApiNotFoundResponse,
    ApiBadRequestResponse
} from '@nestjs/swagger'
import { Request } from 'express';

import { ResponseUserDto } from '../types/classes/users/response-user.dto';
import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { IUser } from '../types/interfaces/users/user.interface';

import { AdminAccessGuard } from '../guards/admin-access.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { UsersService } from './users.service';

@ApiTags('Users')
@ApiSecurity('user')
@ApiUnauthorizedResponse({
    description: 'Needs authorization using Bearer token'
})
@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}
    
    @ApiResponse({
        status: 200,
        description: 'Returns all users (only for admin)',
        isArray: true,
        type: ResponseUserDto
    })
    @ApiForbiddenResponse({
        description: 'Only admin has access to all users'
    })
    @UseGuards(AdminAccessGuard)
    @Get()
    findAll(): Promise<ResponseUserDto[]> {
        return this.usersService.findAll()
    }

    @ApiResponse({
        status: 200,
        description: 'Returns user by id (only fot admin)',
        type: ResponseUserDto
    })
    @ApiForbiddenResponse({
        description: 'Only admin has access to all users'
    })
    @ApiNotFoundResponse({
        description: 'No user with this id'
    })
    @ApiParam({
        name: 'id',
        type: String,
        example: '1'
    })
    @UseGuards(AdminAccessGuard)
    @Get(':id')
    findOne(
        @Param('id') id: string
    ): Promise<ResponseUserDto> {
        return this.usersService.findOne(id).then((user: ResponseUserDto) => {
            return {
                ...user,
                password: undefined
            }
        })
    }

    @ApiResponse({
        status: 201,
        description: 'Creates user (only for admin)',
        type: ResponseUserDto
    })
    @ApiBadRequestResponse({
        description: 'Bad request is given. Follow the request scheme'
    })
    @ApiForbiddenResponse({
        description: 'Only admin has access to all users'
    })
    @ApiConflictResponse({
        description: 'User with this credetials already exists'
    })
    @ApiBody({
        type: RequestUserDto
    })
    @UseGuards(AdminAccessGuard)
    @Post()
    createUser(
        @Body() userDto: RequestUserDto
    ): Promise<ResponseUserDto> {
        return this.usersService.create(userDto, true)
    }

    @ApiResponse({
        status: 201,
        description: 'Updates user\'s data (only for user)',
        type: ResponseUserDto
    })
    @ApiBadRequestResponse({
        description: 'Bad request is given. Follow the request scheme'
    })
    @ApiConflictResponse({
        description: 'User with this credetials already exists'
    })
    @ApiBody({
        type: RequestUserDto
    })
    @Put()
    updateByUser(
        @Req() req: Request,
        @Body() userDto: RequestUserDto
    ): Promise<ResponseUserDto> {
        const user = req.user as IUser

        return this.usersService.update(user.id.toString(), userDto)
    }

    @ApiResponse({
        status: 201,
        description: 'Updates user\'s data (only for admin)',
        type: ResponseUserDto
    })
    @ApiBadRequestResponse({
        description: 'Bad request is given. Follow the request scheme'
    })
    @ApiForbiddenResponse({
        description: 'Only admin has access to all users'
    })
    @ApiNotFoundResponse({
        description: 'No user with this id'
    })
    @ApiConflictResponse({
        description: 'User with this credetials already exists'
    })
    @ApiBody({
        type: RequestUserDto
    })
    @ApiParam({
        name: 'id',
        type: String,
        example: '1'
    })
    @UseGuards(AdminAccessGuard)
    @Put(':id')
    updateByAdmin(
        @Body() userDto: RequestUserDto,
        @Param('id') id: string
    ): Promise<ResponseUserDto> {
        return this.usersService.update(id, userDto, true)
    }

    @ApiResponse({
        status: 200,
        description: 'Delete user by id (only for admin)',
    })
    @ApiForbiddenResponse({
        description: 'Only admin has access to all users'
    })
    @ApiParam({
        name: 'id',
        type: String,
        example: '1'
    })
    @UseGuards(AdminAccessGuard)
    @Delete(':id')
    delete(@Param('id') id: string): void {
        this.usersService.delete(id)
    }
}
