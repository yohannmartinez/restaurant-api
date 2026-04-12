import { z } from 'zod';

export const restaurantUserIdParamSchema = z.string().trim().min(1);
export const restaurantIdParamSchema = z.string().trim().min(1);

export const createRestaurantSchema = z.object({
    name: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(2000).optional(),
    address: z.string().trim().min(1).max(255),
});
