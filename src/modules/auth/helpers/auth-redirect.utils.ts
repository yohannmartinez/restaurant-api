const DEFAULT_AUTH_REDIRECT_PATH = '/auth/success';

export function encodeRedirectPath(redirectPath: string): string | null {
    if (!isSafeFrontendPath(redirectPath)) {
        return null;
    }

    return Buffer.from(redirectPath, 'utf8').toString('base64url');
}

export function decodeRedirectPath(state: unknown): string | null {
    if (typeof state !== 'string' || state.trim().length === 0) {
        return null;
    }

    try {
        const redirectPath = Buffer.from(state, 'base64url').toString('utf8');

        return isSafeFrontendPath(redirectPath) ? redirectPath : null;
    } catch {
        return null;
    }
}

export function buildFrontendRedirectUrl(
    frontendUrl: string,
    state: unknown,
): string {
    const redirectPath = decodeRedirectPath(state) ?? DEFAULT_AUTH_REDIRECT_PATH;

    return new URL(redirectPath, frontendUrl).toString();
}

function isSafeFrontendPath(path: string): boolean {
    return path.startsWith('/') && !path.startsWith('//');
}
