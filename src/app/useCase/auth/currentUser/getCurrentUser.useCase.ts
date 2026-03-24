import { Injectable } from '@nestjs/common';

import { AuthenticatedUser } from 'src/app/domain/auth/model/authenticatedUser.model';

@Injectable()
export class GetCurrentUserUseCase {
    execute(user: AuthenticatedUser): AuthenticatedUser {
        return user;
    }
}
