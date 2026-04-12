import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {
    MembershipStatus,
    RestaurantMembership,
    RestaurantRole,
} from 'src/common/prisma/generated/client';
import { type PrismaClientOrTransaction } from 'src/common/prisma/prisma.types';
import { UsersService } from '../users/users.service';
import { RestaurantMembershipsRepository } from './restaurant-memberships.repository';
import { type RestaurantMemberProfile } from './restaurant-memberships.types';

@Injectable()
export class RestaurantMembershipsService {
    constructor(
        private readonly restaurantMembershipsRepository: RestaurantMembershipsRepository,
        private readonly usersService: UsersService,
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

    async inviteMember(params: {
        inviterUserId: string;
        targetUserEmail: string;
        restaurantId: string;
        role: RestaurantRole;
    }): Promise<RestaurantMembership> {
        const targetUser = await this.usersService.findByEmail(
            params.targetUserEmail,
        );

        if (!targetUser) {
            throw new NotFoundException('User not found');
        }

        if (params.inviterUserId === targetUser.id) {
            throw new ConflictException('You cannot invite yourself');
        }

        if (params.role === RestaurantRole.OWNER) {
            throw new ConflictException('Invitations cannot assign the owner role');
        }

        const existingMembership =
            await this.restaurantMembershipsRepository.findByUserIdAndRestaurantId(
                {
                    userId: targetUser.id,
                    restaurantId: params.restaurantId,
                },
            );

        if (existingMembership?.status === MembershipStatus.ACTIVE) {
            throw new ConflictException('User is already an active restaurant member');
        }

        if (existingMembership?.status === MembershipStatus.INVITED) {
            throw new ConflictException('User already has a pending restaurant invitation');
        }

        return this.restaurantMembershipsRepository.invite({
            userId: targetUser.id,
            restaurantId: params.restaurantId,
            role: params.role,
            invitedByUserId: params.inviterUserId,
        });
    }

    async getRestaurantMembers(params: {
        restaurantId: string;
    }): Promise<RestaurantMemberProfile[]> {
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

    async updateMemberRole(params: {
        restaurantId: string;
        targetUserId: string;
        role: RestaurantRole;
    }): Promise<RestaurantMembership> {
        const targetMembership = await this.restaurantMembershipsRepository.findByUserIdAndRestaurantId(
            {
                userId: params.targetUserId,
                restaurantId: params.restaurantId,
            },
        );

        if (!targetMembership) {
            throw new NotFoundException('Restaurant membership not found');
        }

        return this.restaurantMembershipsRepository.updateRole({
            userId: params.targetUserId,
            restaurantId: params.restaurantId,
            role: params.role,
        });
    }

    async revokeMember(params: {
        restaurantId: string;
        targetUserId: string;
    }): Promise<RestaurantMembership> {
        const targetMembership =
            await this.restaurantMembershipsRepository.findByUserIdAndRestaurantId(
                {
                    userId: params.targetUserId,
                    restaurantId: params.restaurantId,
                },
            );

        if (!targetMembership) {
            throw new NotFoundException('Restaurant membership not found');
        }

        if (targetMembership.status === MembershipStatus.REVOKED) {
            throw new ConflictException('Restaurant membership is already revoked');
        }

        return this.restaurantMembershipsRepository.updateStatus({
            userId: params.targetUserId,
            restaurantId: params.restaurantId,
            status: MembershipStatus.REVOKED,
        });
    }

    async restoreMember(params: {
        restaurantId: string;
        targetUserId: string;
    }): Promise<RestaurantMembership> {
        const targetMembership =
            await this.restaurantMembershipsRepository.findByUserIdAndRestaurantId(
                {
                    userId: params.targetUserId,
                    restaurantId: params.restaurantId,
                },
            );

        if (!targetMembership) {
            throw new NotFoundException('Restaurant membership not found');
        }

        if (targetMembership.status !== MembershipStatus.REVOKED) {
            throw new ConflictException(
                `Restaurant membership cannot be restored`,
            );
        }

        return this.restaurantMembershipsRepository.updateStatus({
            userId: params.targetUserId,
            restaurantId: params.restaurantId,
            status: MembershipStatus.ACTIVE,
        });
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
