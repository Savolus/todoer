import { Body, Controller, Get, Post, Param, HttpException, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { ResponseUserDto } from '../types/classes/users/response-user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { AdminAccessGuard } from 'src/guards/admin-access.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    @UseGuards(AdminAccessGuard)
    @Get()
    findAll(): Promise<ResponseUserDto[]> {
        return this.usersService.findAll()
    }

    @UseGuards(AdminAccessGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<ResponseUserDto> {
        return this.usersService.findOne(id)
    }

    @UseGuards(AdminAccessGuard)
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

    @UseGuards(AdminAccessGuard)
    @Delete(':id')
    remove(@Param('id') id: string): void {
        this.usersService.remove(id)
    }
}
