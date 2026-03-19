import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaUserRepository } from 'src/app/infrastructure/user/user.repository';
import * as bcrypt from 'bcrypt';

type GoogleUserPayload = {
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    googleId: string;
};

@Injectable()
export class LoginWithGoogleUseCase {
    constructor(
        private readonly userRepository: PrismaUserRepository,
        private readonly jwtService: JwtService,
    ) { }

    async execute(googleUser: GoogleUserPayload) {
        const user = await this.userRepository.findByEmail(googleUser.email);

        const persistedUser = user
            ? user
            : await this.userRepository.createFromGoogle({
                email: googleUser.email,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                picture: googleUser.picture,
                googleId: googleUser.googleId,
            });

        const accessToken = await this.jwtService.signAsync(
            {
                sub: persistedUser.id,
                email: persistedUser.email,
            },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            },
        );

        const refreshToken = await this.jwtService.signAsync(
            {
                sub: persistedUser.id,
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            },
        );

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.userRepository.updateRefreshToken(
            persistedUser.id,
            hashedRefreshToken,
        );

        return {
            user: persistedUser,
            accessToken,
            refreshToken,
        };
    }
}