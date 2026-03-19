import {
    Controller,
    Post,
    Req,
    Res,
    UnauthorizedException,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaUserRepository } from '../user/user.repository';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userRepository: PrismaUserRepository,
    ) { }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
        const refreshToken = req.cookies['refresh_token'];

        if (!refreshToken) {
            throw new UnauthorizedException('Missing refresh token');
        }

        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
        });

        const user = await this.userRepository.findById(payload.sub);

        if (!user || !user.hashedRefreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const isValid = await bcrypt.compare(refreshToken, user.hashedRefreshToken);

        if (!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const newAccessToken = await this.jwtService.signAsync(
            {
                sub: user.id,
                email: user.email,
            },
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m',
            },
        );

        const newRefreshToken = await this.jwtService.signAsync(
            {
                sub: user.id,
            },
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d',
            },
        );

        const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

        await this.userRepository.updateRefreshToken(user.id, hashedRefreshToken);

        res.cookie('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.ENVIRONNEMENT === 'prod',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.ENVIRONNEMENT === 'prod',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ success: true });
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
        const refreshToken = req.cookies['refresh_token'];

        if (refreshToken) {
            try {
                const payload = await this.jwtService.verifyAsync(refreshToken, {
                    secret: process.env.JWT_REFRESH_SECRET,
                });

                await this.userRepository.updateRefreshToken(payload.sub, null);
            } catch { }
        }

        res.clearCookie('access_token', {
            httpOnly: true,
            secure: process.env.ENVIRONNEMENT === 'prod',
            sameSite: 'lax',
        });

        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: process.env.ENVIRONNEMENT === 'prod',
            sameSite: 'lax',
        });

        res.status(200).json({ success: true });
    }
}