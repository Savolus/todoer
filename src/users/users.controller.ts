import {
    Body,
    Controller,
    Get,
    Post,
    Param,
    Put,
    Delete,
    UseGuards,
    BadRequestException
} from '@nestjs/common';

import { RequestUserDto } from '../types/classes/users/request-user.dto';
import { IUser } from '../types/interfaces/users/user.interface';

import { AdminAccessGuard } from '../guards/admin-access.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { UsersService } from './users.service';

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
        return this.usersService.findOne(id).then((user: IUser) => {
            return {
                ...user,
                password: undefined
            }
        })
    }

    @UseGuards(AdminAccessGuard)
    @Post()
    create(@Body() userDto: RequestUserDto ): Promise<IUser> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new BadRequestException('Bad request')
        }

        return this.usersService.create(userDto)
    }

    @Put(':id')
    update(@Body() userDto: RequestUserDto, @Param('id') id: string): Promise<IUser> {
        if (!userDto.login || !userDto.password || !userDto.email) {
            throw new BadRequestException('Bad request')
        }

        return this.usersService.update(id, userDto)
    }

    @UseGuards(AdminAccessGuard)
    @Delete(':id')
    remove(@Param('id') id: string): void {
        this.usersService.remove(id)
    }
}
