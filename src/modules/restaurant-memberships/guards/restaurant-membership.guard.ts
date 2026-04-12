import {
    BadRequestException,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RestaurantRole } from 'src/common/prisma/generated/client';
import { RestaurantMembershipsRepository } from '../restaurant-memberships.repository';
import { REQUIRED_RESTAURANT_ROLE_KEY } from '../decorators/require-restaurant-role.decorator';

@Injectable()
export class RestaurantMembershipGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly restaurantMembershipsRepository: RestaurantMembershipsRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.id;
        const restaurantId = this.getRestaurantId(request);

        if (!userId) {
            throw new ForbiddenException('Access denied');
        }

        if (!restaurantId) {
            throw new BadRequestException('restaurantId is required');
        }

        const membership =
            await this.restaurantMembershipsRepository.findByUserIdAndRestaurantId(
                {
                    userId,
                    restaurantId,
                },
            );

        if (!membership) {
            throw new ForbiddenException('Access denied');
        }

        const requiredRole = this.reflector.getAllAndOverride<RestaurantRole>(
            REQUIRED_RESTAURANT_ROLE_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (requiredRole && membership.role !== requiredRole) {
            throw new ForbiddenException(
                `Only restaurant ${requiredRole.toLowerCase()}s can access this resource`,
            );
        }

        request.restaurantMembership = membership;

        return true;
    }

    private getRestaurantId(request: {
        params?: Record<string, unknown>;
        body?: Record<string, unknown>;
        query?: Record<string, unknown>;
    }): string | null {
        const candidates = [
            request.params?.restaurantId,
            request.body?.restaurantId,
            request.query?.restaurantId,
        ];

        for (const candidate of candidates) {
            if (typeof candidate === 'string' && candidate.trim().length > 0) {
                return candidate.trim();
            }
        }

        return null;
    }
}
