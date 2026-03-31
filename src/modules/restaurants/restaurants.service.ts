import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { RestaurantMembershipsService } from '../restaurant-memberships/restaurant-memberships.service';
import {
    type CreateRestaurantInput,
    type CreateRestaurantResult,
} from './restaurants.types';
import { RestaurantsRepository } from './restaurants.repository';

@Injectable()
export class RestaurantsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly restaurantsRepository: RestaurantsRepository,
        private readonly restaurantMembershipsService: RestaurantMembershipsService,
    ) { }

    async createRestaurant(
        ownerId: string,
        input: CreateRestaurantInput,
    ): Promise<CreateRestaurantResult> {
        const name = input.name.trim();
        const description = input.description?.trim() || undefined;
        const address = input.address.trim();
        const slug = this.createSlug(name);

        return this.prisma.$transaction(async (tx) => {
            const restaurant = await this.restaurantsRepository.create(
                {
                    name,
                    slug,
                    description,
                    address,
                },
                tx,
            );

            const membership =
                await this.restaurantMembershipsService.createOwnerMembership(
                    {
                        userId: ownerId,
                        restaurantId: restaurant.id,
                    },
                    tx,
                );

            return {
                ...restaurant,
                memberships: [membership],
            };
        });
    }

    private createSlug(value: string): string {
        return value
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
}
