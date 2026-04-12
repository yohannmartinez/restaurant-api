import { SetMetadata } from '@nestjs/common';
import { RestaurantRole } from 'src/common/prisma/generated/client';

export const REQUIRED_RESTAURANT_ROLE_KEY = 'requiredRestaurantRole';

export const RequireRestaurantRole = (role: RestaurantRole) =>
    SetMetadata(REQUIRED_RESTAURANT_ROLE_KEY, role);
