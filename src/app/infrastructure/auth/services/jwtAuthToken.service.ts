import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import {
    AuthTokenPayload,
    AuthTokens,
    AuthTokenService,
} from 'src/app/domain/auth/service/authToken.service';

@Injectable()
export class JwtAuthTokenService implements AuthTokenService {
    constructor(private readonly jwtService: JwtService) { }

    async generateTokens(payload: AuthTokenPayload): Promise<AuthTokens> {
        const accessToken = await this.jwtService.signAsync(
            {
                sub: payload.sub,
                email: payload.email,
            },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            {
                sub: payload.sub,
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            },
        );

        return { accessToken, refreshToken };
    }

    hashRefreshToken(refreshToken: string): Promise<string> {
        return bcrypt.hash(refreshToken, 10);
    }

    verifyRefreshToken(refreshToken: string): Promise<{ sub: string }> {
        return this.jwtService.verifyAsync<{ sub: string }>(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
        });
    }

    compareRefreshToken(refreshToken: string, hashedRefreshToken: string): Promise<boolean> {
        return bcrypt.compare(refreshToken, hashedRefreshToken);
    }
}
