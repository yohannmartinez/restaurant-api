import { CookieOptions } from 'express';

export const ACCESS_TOKEN_COOKIE_NAME = 'access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

function baseCookieOptions(): CookieOptions {
    return {
        httpOnly: true,
        secure: process.env.ENVIRONNEMENT === 'prod',
        sameSite: 'lax',
    };
}

export function buildAccessTokenCookieOptions(): CookieOptions {
    return {
        ...baseCookieOptions(),
        maxAge: 15 * 60 * 1000,
    };
}

export function buildRefreshTokenCookieOptions(): CookieOptions {
    return {
        ...baseCookieOptions(),
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
}

export function buildClearCookieOptions(): CookieOptions {
    return baseCookieOptions();
}
