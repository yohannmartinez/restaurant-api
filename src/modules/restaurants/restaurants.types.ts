import {
    Restaurant,
    RestaurantMembership,
} from 'src/common/prisma/generated/client';

export type CreateRestaurantInput = {
    name: string;
    description?: string;
    address: string;
};

export type CreateRestaurantResult = Restaurant & {
    memberships: RestaurantMembership[];
};
