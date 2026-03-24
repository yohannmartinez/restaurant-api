import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import {
    AUTH_REPOSITORY,
    type AuthRepository,
} from 'src/app/domain/auth/repository/auth.repository';
import {
    AUTH_TOKEN_SERVICE,
    type AuthTokenService,
} from 'src/app/domain/auth/service/authToken.service';
import {
    USER_REPOSITORY,
    type UserRepository,
} from 'src/app/domain/user/repository/user.repository';

@Injectable()
export class RefreshSessionUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepository,
        @Inject(AUTH_TOKEN_SERVICE)
        private readonly authTokenService: AuthTokenService,
    ) { }

    async execute(refreshToken: string) {
        const payload = await this.authTokenService.verifyRefreshToken(refreshToken);

        const user = await this.userRepository.findById(payload.sub);

        if (!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const isValid = await this.authTokenService.compareRefreshToken(
            refreshToken,
            user.hashedRefreshToken,
        );

        if (!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const tokens = await this.authTokenService.generateTokens({
            sub: user.id,
            email: user.email,
        });

        const hashedRefreshToken = await this.authTokenService.hashRefreshToken(
            tokens.refreshToken,
        );

        await this.authRepository.updateRefreshToken(user.id, hashedRefreshToken);

        return tokens;
    }
}
