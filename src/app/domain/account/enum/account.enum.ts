export const AUTH_PROVIDERS = {
    GOOGLE: 'google',
    GITHUB: 'github',
    APPLE: 'apple',
} as const;

export type AuthProvider =
    (typeof AUTH_PROVIDERS)[keyof typeof AUTH_PROVIDERS];