import { Body, Controller, Get, Post, Param, HttpException, Put, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async findAll(): Promise<User[]> {
        return await this.usersService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<User> {
        const user = await this.usersService.findOne(id)

        if (!user) {
            throw new HttpException('Not Found', 404)
        }

        return user
    }

    @Post()
    async create(@Body() userDto: CreateUserDto ): Promise<void> {
        if (!userDto.login || !userDto.password) {
            throw new HttpException('Bad request', 400) 
        }

        try {
            await this.usersService.create(userDto)
        } catch {
            throw new HttpException('Conflict', 409)
        }
    }

    @Put(':id')
    async update(@Body() userDto: UpdateUserDto, @Param('id') id: string): Promise<void> {
        if (!userDto.login || !userDto.password) {
            throw new HttpException('Bad request', 400) 
        }
  
        try {
            await this.usersService.update(id, userDto)
        } catch {
            throw new HttpException('Internal Server Error', 500)
        }
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        try {
            await this.findOne(id)
        } catch {
            throw new HttpException('Bad request', 404)
        }

        await this.usersService.remove(id)
    }
}
