import { Injectable } from '@nestjs/common';
import {
    MembershipStatus,
    Prisma,
    RestaurantMembership,
    RestaurantRole,
    User,
} from 'src/common/prisma/generated/client';
import { type PrismaClientOrTransaction } from 'src/common/prisma/prisma.types';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class RestaurantMembershipsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        data: Prisma.RestaurantMembershipUncheckedCreateInput,
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<RestaurantMembership> {
        return client.restaurantMembership.create({
            data,
        });
    }

    async findByUserIdAndRestaurantId(
        params: {
            userId: string;
            restaurantId: string;
        },
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<RestaurantMembership | null> {
        return client.restaurantMembership.findUnique({
            where: {
                userId_restaurantId: {
                    userId: params.userId,
                    restaurantId: params.restaurantId,
                },
            },
        });
    }

    async updateStatus(
        params: {
            userId: string;
            restaurantId: string;
            status: MembershipStatus;
        },
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<RestaurantMembership> {
        return client.restaurantMembership.update({
            where: {
                userId_restaurantId: {
                    userId: params.userId,
                    restaurantId: params.restaurantId,
                },
            },
            data: {
                status: params.status,
            },
        });
    }

    async updateRole(
        params: {
            userId: string;
            restaurantId: string;
            role: RestaurantRole;
        },
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<RestaurantMembership> {
        return client.restaurantMembership.update({
            where: {
                userId_restaurantId: {
                    userId: params.userId,
                    restaurantId: params.restaurantId,
                },
            },
            data: {
                role: params.role,
            },
        });
    }

    async invite(
        params: {
            userId: string;
            restaurantId: string;
            role: RestaurantRole;
            invitedByUserId: string;
        },
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<RestaurantMembership> {
        return client.restaurantMembership.upsert({
            where: {
                userId_restaurantId: {
                    userId: params.userId,
                    restaurantId: params.restaurantId,
                },
            },
            create: {
                userId: params.userId,
                restaurantId: params.restaurantId,
                role: params.role,
                status: MembershipStatus.INVITED,
                invitedByUserId: params.invitedByUserId,
            },
            update: {
                role: params.role,
                status: MembershipStatus.INVITED,
                invitedByUserId: params.invitedByUserId,
            },
        });
    }

    async deleteByUserIdAndRestaurantId(
        params: {
            userId: string;
            restaurantId: string;
        },
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<RestaurantMembership> {
        return client.restaurantMembership.delete({
            where: {
                userId_restaurantId: {
                    userId: params.userId,
                    restaurantId: params.restaurantId,
                },
            },
        });
    }

    async findManyMembersByRestaurantId(
        restaurantId: string,
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<
        Array<
            RestaurantMembership & {
                user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'picture'>;
            }
        >
    > {
        return client.restaurantMembership.findMany({
            where: {
                restaurantId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        picture: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }
}
