import { ApiProperty } from '@nestjs/swagger'

import { UserRoleEnum } from '../../enums/user-role.enum'

export class ResponseUserDto {
    @ApiProperty({
        type: Number,
        example: 1,
        description: 'User\'s id'
    })
    readonly id: number

    @ApiProperty({
        type: String,
        example: 'JhonDoeee',
        description: 'User\'s login'
    })
    readonly login: string

    @ApiProperty({
        type: String,
        example: 'jhondoe1997@gmail.com',
        description: 'User\'s email'
    })
    readonly email: string

    @ApiProperty({
        type: 'enum',
        enum: UserRoleEnum,
        example: UserRoleEnum.USER,
        description: 'User\'s role'
    })
    readonly role: string
}
