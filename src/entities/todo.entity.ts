import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    title: string

    @Column()
    description: string
    
    @Column({ default: Math.trunc(Date.now() / 1000) })
    publish_date: number

    @Column()
    expire: number

    @ManyToOne(type => User, user => user.todos)
    user: User
}
