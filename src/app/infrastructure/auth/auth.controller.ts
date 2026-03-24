import {
    Controller,
    Get,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { type Request, type Response } from 'express';

import { RefreshSessionUseCase } from 'src/app/useCase/auth/session/refresh.useCase';
import { LogoutUseCase } from 'src/app/useCase/auth/session/logout.useCase';
import { GetCurrentUserUseCase } from 'src/app/useCase/auth/currentUser/getCurrentUser.useCase';
import {
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
    buildAccessTokenCookieOptions,
    buildClearCookieOptions,
    buildRefreshTokenCookieOptions,
} from './http/authCookie.helper';
import { JwtAuthGuard } from './providers/jwt/jwtAuth.guard';
import { CurrentUser } from './decorators/currentUser.decorator';
import { type AuthenticatedUser } from 'src/app/domain/auth/model/authenticatedUser.model';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly refreshSessionUseCase: RefreshSessionUseCase,
        private readonly logoutUseCase: LogoutUseCase,
        private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
    ) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
        console.log('Authenticated user:', user);
        return this.getCurrentUserUseCase.execute(user);
    }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response): Promise<void> {
        const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

        if (!refreshToken) {
            throw new UnauthorizedException('Missing refresh token');
        }

        const result = await this.refreshSessionUseCase.execute(refreshToken);

        res.cookie(
            ACCESS_TOKEN_COOKIE_NAME,
            result.accessToken,
            buildAccessTokenCookieOptions(),
        );

        res.cookie(
            REFRESH_TOKEN_COOKIE_NAME,
            result.refreshToken,
            buildRefreshTokenCookieOptions(),
        );

        res.status(200).json({ success: true });
    }

    @Post('logout')
    async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
        const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

        await this.logoutUseCase.execute(refreshToken);

        res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, buildClearCookieOptions());
        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, buildClearCookieOptions());

        res.status(200).json({ success: true });
    }
}
