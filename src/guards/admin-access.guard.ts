import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { UserRoleEnum } from '../types/enums/user-role.enum';
import { UsersService } from '../users/users.service';

@Injectable()
export class AdminAccessGuard implements CanActivate {
    constructor(
        private usersService: UsersService
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const decodedUser = context.getArgs()[0].res.req.user

        try {
            const user = await this.usersService.findOne(decodedUser.id)
        
            return user.role === UserRoleEnum.ADMIN
        } catch {
            return false
        }
    }
}
