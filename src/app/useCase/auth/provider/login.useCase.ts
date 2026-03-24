import { Inject, Injectable } from '@nestjs/common';

import { OAuthUserPayload } from 'src/app/domain/auth/model/oauthUserPayload.model';
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
export class LoginWithOAuthProviderUseCase {
    constructor(
        @Inject(USER_REPOSITORY)
        private readonly userRepository: UserRepository,
        @Inject(AUTH_REPOSITORY)
        private readonly authRepository: AuthRepository,
        @Inject(AUTH_TOKEN_SERVICE)
        private readonly authTokenService: AuthTokenService,
    ) { }

    async execute(oauthUser: OAuthUserPayload) {
        let user = await this.authRepository.findByProviderAccount(
            oauthUser.provider,
            oauthUser.providerAccountId,
        );

        if (!user) {
            user = await this.userRepository.findByEmail(oauthUser.email);

            if (user) {
                await this.authRepository.linkAuthProvider(user.id, {
                    provider: oauthUser.provider,
                    providerAccountId: oauthUser.providerAccountId,
                });
            } else {
                user = await this.authRepository.createWithAuthProvider({
                    email: oauthUser.email,
                    firstName: oauthUser.firstName,
                    lastName: oauthUser.lastName,
                    picture: oauthUser.picture,
                    authProvider: {
                        provider: oauthUser.provider,
                        providerAccountId: oauthUser.providerAccountId,
                    },
                });
            }
        }

        const tokens = await this.authTokenService.generateTokens({
            sub: user.id,
            email: user.email,
        });

        const hashedRefreshToken = await this.authTokenService.hashRefreshToken(
            tokens.refreshToken,
        );

        await this.authRepository.updateRefreshToken(user.id, hashedRefreshToken);

        return {
            user,
            ...tokens,
        };
    }
}
