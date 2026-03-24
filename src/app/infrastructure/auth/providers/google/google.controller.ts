import {
    Controller,
    Get,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { type Request, type Response } from 'express';
import { GoogleAuthGuard } from './google.guard';
import { LoginWithOAuthProviderUseCase } from 'src/app/useCase/auth/provider/login.useCase';
import { OAuthUserPayload } from 'src/app/domain/auth/model/oauthUserPayload.model';
import {
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME,
    buildAccessTokenCookieOptions,
    buildRefreshTokenCookieOptions,
} from '../../http/authCookie.helper';

type RequestWithUser = Request & { user: OAuthUserPayload };

@Controller('auth/google')
export class GoogleAuthController {
    constructor(
        private readonly loginWithOAuthProviderUseCase: LoginWithOAuthProviderUseCase,
    ) { }

    @Get()
    @UseGuards(GoogleAuthGuard)
    async googleLogin(): Promise<void> { }

    @Get('callback')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(@Req() req: RequestWithUser, @Res() res: Response): Promise<void> {
        const result = await this.loginWithOAuthProviderUseCase.execute(req.user);

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

        res.redirect(`${process.env.FRONTEND_URL}/auth/success`);
    }
}
