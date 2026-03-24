import { Inject, Injectable } from '@nestjs/common';

import {
    AUTH_REPOSITORY,
    type AuthRepository,
} from 'src/app/domain/auth/repository/auth.repository';
import {
    AUTH_TOKEN_SERVICE,
    type AuthTokenService,
} from 'src/app/domain/auth/service/authToken.service';

@Injectable()
export class LogoutUseCase {
    constructor(
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepository,
        @Inject(AUTH_TOKEN_SERVICE)
        private readonly authTokenService: AuthTokenService,
    ) { }

    async execute(refreshToken?: string): Promise<void> {
        if (!refreshToken) {
            return;
        }

        try {
            const payload = await this.authTokenService.verifyRefreshToken(refreshToken);
            await this.authRepository.updateRefreshToken(payload.sub, null);
        } catch {
            return;
        }
    }
}
