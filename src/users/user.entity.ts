import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm'
import { Todo } from '../todos/todo.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number

    @Column()
    login: string

    @Column()
    password: string

    @OneToMany(type => Todo, todo => todo.user)
    todos: Todo[]
}
