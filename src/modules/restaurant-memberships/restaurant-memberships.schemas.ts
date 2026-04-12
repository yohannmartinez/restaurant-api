import { z } from 'zod';
import { RestaurantRole } from 'src/common/prisma/generated/client';

export const restaurantInvitationActionSchema = z.object({
    restaurantId: z.string().trim().min(1),
});

export const inviteRestaurantMemberSchema = z.object({
    restaurantId: z.string().trim().min(1),
    email: z.string().trim().email(),
    role: z.nativeEnum(RestaurantRole).default(RestaurantRole.EDITOR),
});

export const updateRestaurantMemberRoleSchema = z.object({
    restaurantId: z.string().trim().min(1),
    userId: z.string().trim().min(1),
    role: z.nativeEnum(RestaurantRole),
});

export const revokeRestaurantMemberSchema = z.object({
    restaurantId: z.string().trim().min(1),
    userId: z.string().trim().min(1),
});

export const restoreRestaurantMemberSchema = z.object({
    restaurantId: z.string().trim().min(1),
    userId: z.string().trim().min(1),
});
