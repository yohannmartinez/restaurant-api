import { AuthProvider } from 'src/app/domain/account/enum/account.enum';
import { User } from 'src/app/domain/user/model/user.model';

export const AUTH_REPOSITORY = Symbol('AUTH_REPOSITORY');

export interface CreateUserWithAuthProviderInput {
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    authProvider: {
        provider: AuthProvider;
        providerAccountId: string;
    };
}

export interface LinkAuthProviderInput {
    provider: AuthProvider;
    providerAccountId: string;
}

export interface AuthRepository {
    findByProviderAccount(
        provider: AuthProvider,
        providerAccountId: string,
    ): Promise<User | null>;
    createWithAuthProvider(
        data: CreateUserWithAuthProviderInput,
    ): Promise<User>;
    linkAuthProvider(
        userId: string,
        data: LinkAuthProviderInput,
    ): Promise<void>;
    updateRefreshToken(
        userId: string,
        hashedRefreshToken: string | null,
    ): Promise<void>;
}
