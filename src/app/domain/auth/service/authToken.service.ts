export const AUTH_TOKEN_SERVICE = Symbol('AUTH_TOKEN_SERVICE');

export interface AuthTokenPayload {
    sub: string;
    email?: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthTokenService {
    generateTokens(payload: AuthTokenPayload): Promise<AuthTokens>;
    hashRefreshToken(refreshToken: string): Promise<string>;
    verifyRefreshToken(refreshToken: string): Promise<{ sub: string }>;
    compareRefreshToken(refreshToken: string, hashedRefreshToken: string): Promise<boolean>;
}
