import {
    Restaurant,
    RestaurantMembership,
} from 'src/common/prisma/generated/client';
import { type RestaurantMemberProfile } from '../restaurant-memberships/restaurant-memberships.types';

export type CreateRestaurantInput = {
    name: string;
    description?: string;
    address: string;
};

export type CreateRestaurantResult = Restaurant & {
    memberships: RestaurantMembership[];
};

export type GetUserRestaurantsResult = Array<
    Restaurant & {
        memberships: RestaurantMembership[];
    }
>;

export type GetRestaurantMembersResult = RestaurantMemberProfile[];
