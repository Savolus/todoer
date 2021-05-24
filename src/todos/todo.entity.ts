import { User } from 'src/users/user.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    title: string

    @Column()
    content: string
    
    @Column({ default: Date.now() / 1000 })
    publish_date: number

    @Column()
    estimate: number

    @ManyToOne(type => User, user => user.todos)
    user: User
}
