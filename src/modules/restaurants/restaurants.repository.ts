import { Injectable } from '@nestjs/common';
import {
    Prisma,
    Restaurant,
    RestaurantMembership,
} from 'src/common/prisma/generated/client';
import { type PrismaClientOrTransaction } from 'src/common/prisma/prisma.types';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class RestaurantsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(
        data: Prisma.RestaurantCreateInput,
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<Restaurant> {
        return client.restaurant.create({
            data,
        });
    }

    async findManyByUserId(userId: string): Promise<
        Array<
            Restaurant & {
                memberships: RestaurantMembership[];
            }
        >
    > {
        return this.prisma.restaurant.findMany({
            where: {
                memberships: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                memberships: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
