import {
    Controller,
    Get,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { GoogleAuthGuard } from '../guards/google.guard';
import { LoginWithGoogleUseCase } from 'src/app/useCase/auth/google/login.useCase';

@Controller('auth/google')
export class GoogleAuthController {
    constructor(
        private readonly loginWithGoogleUseCase: LoginWithGoogleUseCase,
    ) { }

    @Get()
    @UseGuards(GoogleAuthGuard)
    async googleLogin(): Promise<void> { }

    @Get('callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(@Req() req: Request, @Res() res: Response): Promise<void> {
        const result = await this.loginWithGoogleUseCase.execute(req.user as any);

        res.cookie('access_token', result.accessToken, {
            httpOnly: true,
            secure: process.env.ENVIRONNEMENT === 'prod',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh_token', result.refreshToken, {
            httpOnly: true,
            secure: process.env.ENVIRONNEMENT === 'prod',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    }
}