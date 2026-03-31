import { Injectable } from '@nestjs/common';
import {
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
}
