import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
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

    async acceptInvitation(params: {
        userId: string;
        restaurantId: string;
    }): Promise<RestaurantMembership> {
        await this.ensureInvitedMembership(params, 'accepted');

        return this.restaurantMembershipsRepository.updateStatus({
            ...params,
            status: MembershipStatus.ACTIVE,
        });
    }

    async declineInvitation(params: {
        userId: string;
        restaurantId: string;
    }): Promise<RestaurantMembership> {
        await this.ensureInvitedMembership(params, 'declined');

        return this.restaurantMembershipsRepository.deleteByUserIdAndRestaurantId(
            params,
        );
    }

    private async ensureInvitedMembership(
        params: {
            userId: string;
            restaurantId: string;
        },
        action: 'accepted' | 'declined',
    ): Promise<RestaurantMembership> {
        const membership =
            await this.restaurantMembershipsRepository.findByUserIdAndRestaurantId(
                params,
            );

        if (!membership) {
            throw new NotFoundException('Restaurant invitation not found');
        }

        if (membership.status !== MembershipStatus.INVITED) {
            throw new ConflictException(
                `Restaurant invitation cannot be ${action} from status ${membership.status}`,
            );
        }

        return membership;
    }
}
