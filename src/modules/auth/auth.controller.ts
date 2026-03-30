import {
    Controller,
    Get,
    Post,
    Res,
    UseGuards,
} from '@nestjs/common';
import { type Response } from 'express';
import { AuthService } from './auth.service';
import {
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
} from './auth.constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/providers/google-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { CurrentUserId } from './decorators/current-user-id.decorator';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
    authUserSchema,
    authUserIdSchema,
    oAuthUserSchema,
    refreshAuthUserSchema,
} from './auth.schemas';
import { User } from 'src/common/prisma/generated/client';
import {
    type AuthUser,
    type OAuthUser,
    type RefreshAuthUser,
} from './auth.types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('google')
    @UseGuards(GoogleAuthGuard)
    async googleLogin() { }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(
        @CurrentUser(new ZodValidationPipe(oAuthUserSchema))
        oauthUser: OAuthUser,
        @Res() res: Response,
    ): Promise<void> {
        const result = await this.authService.loginWithOAuth(oauthUser);

        this.setAuthCookies(res, result.accessToken, result.refreshToken);

        return res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(
        @CurrentUser(new ZodValidationPipe(authUserSchema))
        user: AuthUser,
    ): Promise<User> {
        return this.authService.getMe(user.id);
    }

    @Post('refresh')
    @UseGuards(RefreshTokenGuard)
    async refresh(
        @CurrentUser(new ZodValidationPipe(refreshAuthUserSchema))
        user: RefreshAuthUser,
        @Res() res: Response,
    ) {
        const result = await this.authService.refreshTokens(
            user.id,
            user.refreshToken,
        );

        this.setAuthCookies(res, result.accessToken, result.refreshToken);

        return res.status(200).json({
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
        });
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Res() res: Response,
    ): Promise<Response> {
        await this.authService.logout(userId);
        this.clearAuthCookies(res);

        return res.json({
            message: 'Logged out successfully',
        });
    }

    private setAuthCookies(
        res: Response,
        accessToken: string,
        refreshToken: string,
    ): void {
        const isProduction = process.env.NODE_ENV === 'production';
        const secure = process.env.COOKIE_SECURE === 'true' || isProduction;

        res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
            httpOnly: true,
            secure,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
    }

    private clearAuthCookies(res: Response): void {
        res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });

        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });
    }
}
