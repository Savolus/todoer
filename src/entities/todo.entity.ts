import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne
} from 'typeorm'

import { User } from './user.entity'

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    title: string

    @Column({ length: 4096 })
    description: string
    
    @Column({ type: 'datetime' })
    publish_date: Date

    @Column({ type: 'datetime' })
    estimate: Date

    @ManyToOne(() => User, user => user.todos)
    user: User
}
