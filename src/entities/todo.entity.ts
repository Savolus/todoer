import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    DeleteDateColumn
} from 'typeorm'

import { User } from './user.entity'

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    title: string

    @Column()
    description: string
    
    @CreateDateColumn()
    publish_date: Date

    @DeleteDateColumn()
    estimate: Date

    @ManyToOne(type => User, user => user.todos)
    user: User
}
