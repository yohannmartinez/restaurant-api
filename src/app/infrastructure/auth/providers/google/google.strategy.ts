import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { AUTH_PROVIDERS } from 'src/app/domain/account/enum/account.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: VerifyCallback,
    ): Promise<void> {
        const email = profile.emails?.[0]?.value;
        const firstName = profile.name?.givenName;
        const lastName = profile.name?.familyName;
        const picture = profile.photos?.[0]?.value;

        if (!email) {
            done(new UnauthorizedException('Google account has no email'), false);
            return;
        }

        done(null, {
            email,
            firstName,
            lastName,
            picture,
            provider: AUTH_PROVIDERS.GOOGLE,
            providerAccountId: profile.id,
        });
    }
}
