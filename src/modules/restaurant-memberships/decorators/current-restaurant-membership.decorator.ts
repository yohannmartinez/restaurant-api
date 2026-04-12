import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentRestaurantMembership = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.restaurantMembership;
    },
);
