import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AccountProviders } from 'src/common/prisma/generated/client';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { type OAuthUser } from '../../auth.types';

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
        const providerAccountId = profile.id;

        if (!email) {
            return done(
                new UnauthorizedException('Google account has no email'),
                false,
            );
        }

        const oauthUser: OAuthUser = {
            email,
            firstName,
            lastName,
            picture,
            provider: AccountProviders.GOOGLE,
            providerAccountId,
        };

        done(null, oauthUser);
    }
}
