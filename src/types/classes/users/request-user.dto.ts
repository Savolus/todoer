import { UserRoleEnum } from "src/types/enums/user-role.enum"

export class RequestUserDto {
    readonly login: string
    readonly password: string
    readonly email: string
    readonly role: UserRoleEnum = UserRoleEnum.USER
}
