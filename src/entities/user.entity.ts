import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { UserRoleEnum } from '../types/enums/user-role.enum'
import { Todo } from './todo.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id?: number

    @Column({ unique: true })
    login: string

    @Column()
    password: string

    @Column({ unique: true })
    email: string

    @Column({ default: UserRoleEnum.USER })
    role?: UserRoleEnum

    @OneToMany(type => Todo, todo => todo.user)
    todos?: Todo[]
}
