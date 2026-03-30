import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/common/prisma/generated/client';
import * as bcrypt from 'bcrypt';
import type { StringValue } from 'ms';
import { UsersService } from '../users/users.service';
import { AccountsService } from '../accounts/accounts.service';
import { type AuthTokens, type OAuthUser } from './auth.types';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private readonly accountsService: AccountsService,
    ) { }

    async loginWithOAuth(
        oauthUser: OAuthUser,
    ): Promise<{ user: User } & AuthTokens> {
        let user = await this.accountsService.findUserByProviderAccount(
            oauthUser.provider,
            oauthUser.providerAccountId,
        );

        if (!user) {
            user = await this.usersService.findByEmail(oauthUser.email);

            if (!user) {
                user = await this.usersService.create({
                    email: oauthUser.email,
                    firstName: oauthUser.firstName,
                    lastName: oauthUser.lastName,
                    picture: oauthUser.picture,
                });
            }

            const existingAccount =
                await this.accountsService.findByUserIdAndProvider({
                    userId: user.id,
                    provider: oauthUser.provider,
                });

            if (!existingAccount) {
                await this.accountsService.linkProviderToUser({
                    userId: user.id,
                    provider: oauthUser.provider,
                    providerAccountId: oauthUser.providerAccountId,
                });
            }
        }

        const tokens = await this.generateTokens(user);
        await this.storeHashedRefreshToken(user.id, tokens.refreshToken);

        return {
            user,
            ...tokens,
        };
    }

    async getMe(userId: string): Promise<User> {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }

    async refreshTokens(
        userId: string,
        refreshToken: string,
    ): Promise<{ user: User } & AuthTokens> {
        const user = await this.usersService.findById(userId);

        if (!user) {
            throw new ForbiddenException('Access denied');
        }

        if (!user.hashedRefreshToken) {
            throw new ForbiddenException('Access denied');
        }

        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.hashedRefreshToken,
        );

        if (!isRefreshTokenValid) {
            throw new ForbiddenException('Access denied');
        }

        const tokens = await this.generateTokens(user);
        await this.storeHashedRefreshToken(user.id, tokens.refreshToken);

        return {
            user,
            ...tokens,
        };
    }

    async logout(userId: string): Promise<void> {
        const user = await this.usersService.findById(userId);

        if (!user) {
            return;
        }

        await this.usersService.updateHashedRefreshToken(userId, null);
    }

    private async generateTokens(user: User): Promise<AuthTokens> {
        const accessSecret = process.env.JWT_ACCESS_SECRET;
        const refreshSecret = process.env.JWT_REFRESH_SECRET;

        if (!accessSecret || !refreshSecret) {
            throw new InternalServerErrorException('JWT configuration is missing');
        }

        const payload = {
            sub: user.id,
            email: user.email,
        };

        const accessExpiresIn =
            (process.env.JWT_ACCESS_EXPIRES_IN as StringValue | undefined) ?? '15m';

        const refreshExpiresIn =
            (process.env.JWT_REFRESH_EXPIRES_IN as StringValue | undefined) ?? '7d';

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: accessSecret,
                expiresIn: accessExpiresIn,
            }),
            this.jwtService.signAsync(payload, {
                secret: refreshSecret,
                expiresIn: refreshExpiresIn,
            }),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async storeHashedRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.usersService.updateHashedRefreshToken(
            userId,
            hashedRefreshToken,
        );
    }
}