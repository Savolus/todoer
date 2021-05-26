export interface IUser {
    readonly id: number,
    readonly login: string,
    readonly email: string,
    readonly password?: string,
    readonly role?: string,
    readonly iat?: number,
    readonly exp?: number
}
