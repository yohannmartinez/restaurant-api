import { AccountProvider } from 'src/common/prisma/generated/client';
import { z } from 'zod';

export const authUserIdSchema = z.string().trim().min(1);

export const authUserSchema = z.object({
    id: authUserIdSchema,
    email: z.email(),
});

export const refreshAuthUserSchema = authUserSchema.extend({
    refreshToken: z.string().trim().min(1),
});

export const oAuthUserSchema = z.object({
    email: z.email(),
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
    picture: z.url().optional(),
    provider: z.nativeEnum(AccountProvider),
    providerAccountId: z.string().trim().min(1),
});
