import { Body, Controller, Get, Post, Param, HttpException, Put, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { ResponseUserDto } from '../types/classes/users/response-user.dto';

@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @Get()
    findAll(): Promise<ResponseUserDto[]> {
        return this.usersService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<ResponseUserDto> {
        return this.usersService.findOne(id)
    }

    @Post()
    create(@Body() userDto: RequestUserDto ): Promise<ResponseUserDto> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new HttpException('Bad request', 400) 
        }

        return this.usersService.create(userDto)
    }

    @Put(':id')
    update(@Body() userDto: RequestUserDto, @Param('id') id: string): Promise<ResponseUserDto> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new HttpException('Bad request', 400) 
        }

        return this.usersService.update(id, userDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string): void {
        this.usersService.remove(id)
    }
}
