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
    ApiConflictResponse
} from '@nestjs/swagger'
import { Request } from 'express';

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
        description: 'Get all users',
        isArray: true,
        schema: {
            example: [
                {
                    "id": 1,
                    "login": "admin",
                    "email": "admin@admin.com",
                    "role": "admin"
                },
                {
                    "id": 2,
                    "login": "JhonDoeee",
                    "email": "jhondoe1997@gamil.com",
                    "role": "user"
                }
            ]
        }
    })
    @ApiForbiddenResponse({
        description: 'Only for ADMIN role'
    })
    @UseGuards(AdminAccessGuard)
    @Get()
    findAll(): Promise<IUser[]> {
        return this.usersService.findAll()
    }

    @ApiResponse({
        status: 200,
        description: 'Get user by id',
        schema: {
            example: {
                "id": 2,
                "login": "JhonDoeee",
                "email": "jhondoe1997@gamil.com",
                "role": "user"
            }
        }
    })
    @ApiForbiddenResponse({
        description: 'Only for ADMIN role'
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
    ): Promise<IUser> {
        return this.usersService.findOne(id).then((user: IUser) => {
            return {
                ...user,
                password: undefined
            }
        })
    }

    @ApiResponse({
        status: 201,
        description: 'Create user',
        schema: {
            example: {
                "id": 2,
                "login": "JhonDoeee",
                "email": "jhondoe1997@gamil.com",
                "role": "user"
            }
        }
    })
    @ApiForbiddenResponse({
        description: 'Only for ADMIN role'
    })
    @ApiConflictResponse({
        description: 'User with this credetials already exists'
    })
    @ApiBody({
        type: RequestUserDto
    })
    @UseGuards(AdminAccessGuard)
    @Post()
    create(
        @Body() userDto: RequestUserDto
    ): Promise<IUser> {
        return this.usersService.create(userDto, true)
    }

    @ApiResponse({
        status: 201,
        description: 'Update user\'s data (by user)',
        schema: {
            example: {
                "id": 2,
                "login": "JhonDoeee1337",
                "email": "jhondoe1997@gamil.com",
                "role": "user"
            }
        }
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
    ): Promise<IUser> {
        const user = req.user as IUser

        return this.usersService.update(user.id.toString(), userDto)
    }

    @ApiResponse({
        status: 201,
        description: 'Update user\'s data (by admin)',
        schema: {
            example: {
                "id": 2,
                "login": "JhonDoeee1337",
                "email": "jhondoe1997@gamil.com",
                "role": "user"
            }
        }
    })
    @ApiForbiddenResponse({
        description: 'Only for ADMIN role'
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
    @Put(':id')
    updateByAdmin(
        @Body() userDto: RequestUserDto,
        @Param('id') id: string
    ): Promise<IUser> {
        return this.usersService.update(id, userDto, true)
    }

    @ApiResponse({
        status: 200,
        description: 'Delete user by id',
    })
    @ApiForbiddenResponse({
        description: 'Only for ADMIN role'
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
