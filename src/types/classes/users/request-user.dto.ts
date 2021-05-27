import {
    IsOptional,
    IsNotEmpty,
    IsString,
    IsAscii,
    IsEmail,
    IsEnum,
    MinLength,
    MaxLength
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { ValidationErrors } from '../../constants/validation-errors-constants'
import { UserRoleEnum } from "../../enums/user-role.enum"

export class RequestUserDto {
    @ApiProperty({
        type : String,
        example : 'JhonDoeee',
        description : 'User\'s login',
        minLength: 4,
        maxLength: 16,
        uniqueItems: true
    })
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsString({ message: ValidationErrors.IS_STRING })
    @IsAscii({ message: ValidationErrors.IS_ASCII })
    @MinLength(4, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(16, { message: ValidationErrors.MAX_LENGTH })
    readonly login: string

    @ApiProperty({
        type : String,
        example : '12345678',
        description : 'User\'s password',
        minLength: 8,
        maxLength: 20
    })
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsString({ message: ValidationErrors.IS_STRING })
    @MinLength(8, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(20, { message: ValidationErrors.MAX_LENGTH })
    readonly password: string

    @ApiProperty({
        type : String,
        example : 'jhondoe1997@gmail.com',
        description : 'User\'s email',
        uniqueItems: true
    })
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsString({ message: ValidationErrors.IS_STRING })
    @IsEmail({}, { message: ValidationErrors.IS_EMAIL })
    readonly email: string

    @ApiProperty({
        type: 'enum',
        enum: UserRoleEnum,
        example : UserRoleEnum.USER,
        default: UserRoleEnum.USER,
        description : 'User\'s role'
    })
    @IsOptional()
    @IsString({ message: ValidationErrors.IS_STRING })
    @IsEnum(UserRoleEnum, { message: ValidationErrors.IS_ENUM })
    readonly role: UserRoleEnum = UserRoleEnum.USER
}
