import { Body, Controller, Get, Post, Param, HttpException, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminAccessGuard } from 'src/guards/admin-access.guard';
import { IUser } from 'src/types/interfaces/users/user.interface';

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
    findOne(@Param('id') id: string): Promise<IUser> {
        return {
            ...this.usersService.findOne(id),
            password: undefined
        } as Promise<IUser>
    }

    @UseGuards(AdminAccessGuard)
    @Post()
    create(@Body() userDto: RequestUserDto ): Promise<IUser> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new HttpException('Bad request', 400) 
        }

        return this.usersService.create(userDto)
    }

    @Put(':id')
    update(@Body() userDto: RequestUserDto, @Param('id') id: string): Promise<IUser> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new HttpException('Bad request', 400) 
        }

        return this.usersService.update(id, userDto)
    }

    @UseGuards(AdminAccessGuard)
    @Delete(':id')
    remove(@Param('id') id: string): void {
        this.usersService.remove(id)
    }
}
