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

import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { IUser } from '../types/interfaces/users/user.interface';

import { AdminAccessGuard } from '../guards/admin-access.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { UsersService } from './users.service';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @UseGuards(AdminAccessGuard)
    @Get()
    findAll(): Promise<IUser[]> {
        return this.usersService.findAll()
    }

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

    @UseGuards(AdminAccessGuard)
    @Post()
    create(
        @Body() userDto: RequestUserDto
    ): Promise<IUser> {
        return this.usersService.create(userDto)
    }

    @Put()
    updateByUser(
        @Req() req: Request,
        @Body() userDto: RequestUserDto
    ): Promise<IUser> {
        const user = req.user as IUser

        return this.usersService.update(user.id.toString(), userDto)
    }

    @Put(':id')
    updateByAdmin(
        @Body() userDto: RequestUserDto,
        @Param('id') id: string
    ): Promise<IUser> {
        return this.usersService.update(id, userDto, true)
    }

    @UseGuards(AdminAccessGuard)
    @Delete(':id')
    delete(@Param('id') id: string): void {
        this.usersService.delete(id)
    }
}
