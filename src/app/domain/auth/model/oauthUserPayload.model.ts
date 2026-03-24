import { AuthProvider } from 'src/app/domain/account/enum/account.enum';

export interface OAuthUserPayload {
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    provider: AuthProvider;
    providerAccountId: string;
}
