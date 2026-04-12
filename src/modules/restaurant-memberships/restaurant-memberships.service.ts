import {
    ConflictException,
    ForbiddenException,
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
import { type RestaurantMemberProfile } from './restaurant-memberships.types';

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

    async getRestaurantMembers(params: {
        currentUserId: string;
        restaurantId: string;
    }): Promise<RestaurantMemberProfile[]> {
        const currentUserMembership =
            await this.restaurantMembershipsRepository.findByUserIdAndRestaurantId(
                {
                    userId: params.currentUserId,
                    restaurantId: params.restaurantId,
                },
            );

        if (!currentUserMembership) {
            throw new ForbiddenException('Access denied');
        }

        const memberships =
            await this.restaurantMembershipsRepository.findManyMembersByRestaurantId(
                params.restaurantId,
            );

        return memberships.map((membership) => ({
            userId: membership.user.id,
            email: membership.user.email,
            firstName: membership.user.firstName,
            lastName: membership.user.lastName,
            picture: membership.user.picture,
            role: membership.role,
            status: membership.status,
            createdAt: membership.createdAt,
        }));
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
