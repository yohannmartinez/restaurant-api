import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { authUserIdSchema } from '../auth/auth.schemas';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
    createRestaurantSchema,
    restaurantIdParamSchema,
} from './restaurants.schemas';
import {
    type CreateRestaurantInput,
    type CreateRestaurantResult,
    type GetRestaurantMembersResult,
    type GetUserRestaurantsResult,
} from './restaurants.types';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurant')
export class RestaurantsController {
    constructor(private readonly restaurantsService: RestaurantsService) { }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMyRestaurants(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
    ): Promise<GetUserRestaurantsResult> {
        return this.restaurantsService.getUserRestaurants(userId);
    }

    @Get(':restaurantId/members')
    @UseGuards(JwtAuthGuard)
    async getRestaurantMembers(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Param('restaurantId', new ZodValidationPipe(restaurantIdParamSchema))
        restaurantId: string,
    ): Promise<GetRestaurantMembersResult> {
        return this.restaurantsService.getRestaurantMembers(userId, restaurantId);
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Body(new ZodValidationPipe(createRestaurantSchema))
        body: CreateRestaurantInput,
    ): Promise<CreateRestaurantResult> {
        return this.restaurantsService.createRestaurant(userId, body);
    }
}
