import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from 'typeorm'
import { hash } from 'bcrypt'

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

    @Column({
        type: 'enum',
        enum: UserRoleEnum,
        default: UserRoleEnum.USER
    })
    role?: UserRoleEnum

    @OneToMany(() => Todo, todo => todo.user)
    todos?: Todo[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, 10)
    }
}
