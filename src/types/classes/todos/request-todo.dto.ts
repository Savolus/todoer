import {
    IsNotEmpty,
    IsString,
    IsInt,
    Min,
    MinLength,
    MaxLength
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

import { ValidationErrors } from '../../constants/validation-errors-constants'

export class RequestTodoDto {
    @ApiProperty({
        type : String,
        example : 'Buy water',
        description : 'Todo\'s title',
        minLength: 4,
        maxLength: 255
    })
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MinLength(4, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(255, { message: ValidationErrors.MAX_LENGTH })
    readonly title: string

    @ApiProperty({
        type : String,
        example : 'Go to the market and buy water',
        description : 'Todo\'s description',
        minLength: 4,
        maxLength: 4096
    })
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @MinLength(4, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(4096, { message: ValidationErrors.MAX_LENGTH })
    readonly description: string

    @ApiProperty({
        type : Number,
        example : 1624767955000,
        description : 'Unix date representation of todo\'s estimate date',
        minimum: Date.now()
    })
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsInt({ message: ValidationErrors.IS_DATE })
    @Min(Date.now(), { message: ValidationErrors.MIN_DATE })
    readonly estimate: number
}
