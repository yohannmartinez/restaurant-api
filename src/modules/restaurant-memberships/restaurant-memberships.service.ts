import { Injectable } from '@nestjs/common';
import {
    MembershipStatus,
    RestaurantMembership,
    RestaurantRole,
} from 'src/common/prisma/generated/client';
import { type PrismaClientOrTransaction } from 'src/common/prisma/prisma.types';
import { RestaurantMembershipsRepository } from './restaurant-memberships.repository';

@Injectable()
export class RestaurantMembershipsService {
    constructor(
        private readonly restaurantMembershipsRepository: RestaurantMembershipsRepository,
    ) { }

    async createOwnerMembership(
        params: {
            userId: string;
            restaurantId: string;
        },
        client?: PrismaClientOrTransaction,
    ): Promise<RestaurantMembership> {
        return this.restaurantMembershipsRepository.create(
            {
                userId: params.userId,
                restaurantId: params.restaurantId,
                role: RestaurantRole.OWNER,
                status: MembershipStatus.ACTIVE,
            },
            client,
        );
    }
}
