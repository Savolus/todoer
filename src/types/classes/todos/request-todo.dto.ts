import {
    IsNotEmpty,
    IsString,
    IsInt,
    Min,
    MinLength,
    MaxLength
} from 'class-validator'

import { ValidationErrors } from '../../constants/validation-errors-constants'

export class RequestTodoDto {
    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsString({ message: ValidationErrors.IS_STRING })
    @MinLength(4, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(255, { message: ValidationErrors.MAX_LENGTH })
    readonly title: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsString({ message: ValidationErrors.IS_STRING })
    @MinLength(4, { message: ValidationErrors.MIN_LENGTH })
    @MaxLength(4096, { message: ValidationErrors.MAX_LENGTH })
    readonly description: string

    @IsNotEmpty({ message: ValidationErrors.IS_NOT_EMPTY })
    @IsInt({ message: ValidationErrors.IS_DATE })
    @Min(Date.now(), { message: ValidationErrors.MIN_DATE })
    readonly estimate: number
}
