import { z } from 'zod';

export const restaurantInvitationActionSchema = z.object({
    restaurantId: z.string().trim().min(1),
});
