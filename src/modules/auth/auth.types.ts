import { AccountProviders } from 'src/common/prisma/generated/client';

export type AuthUser = {
    id: string;
    email: string;
};

export type RefreshAuthUser = AuthUser & {
    refreshToken: string;
};

export type OAuthUser = {
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    provider: AccountProviders;
    providerAccountId: string;
};

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
}