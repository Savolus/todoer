import { ApiProperty } from '@nestjs/swagger'

export class ResponseTodoDto {
    @ApiProperty({
        type: Number,
        example: 1,
        description: 'User\'s todo\'s id'
    })
    readonly id: number

    @ApiProperty({
        type: String,
        example: 'Buy water',
        description: 'User\'s todo\'s title'
    })
    readonly title: string
    
    @ApiProperty({
        type: String,
        example: 'Go to the market and buy water',
        description: 'User\'s todo\'s description'
    })
    readonly description: string

    @ApiProperty({
        type: Date,
        example: '2021-05-27T09:20:56.000Z',
        description: 'User\'s todo\'s publish date'
    })
    readonly publish_date: Date

    @ApiProperty({
        type: Date,
        example: '2021-06-27T09:20:56.000Z',
        description: 'User\'s todo\'s estimate date'
    })
    readonly estimate: Date
}
