import { Injectable } from '@nestjs/common';
import {
    MembershipStatus,
    Prisma,
    RestaurantMembership,
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
}
