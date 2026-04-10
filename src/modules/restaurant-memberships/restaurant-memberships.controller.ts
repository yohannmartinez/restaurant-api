import {
    Body,
    Controller,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { authUserIdSchema } from '../auth/auth.schemas';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RestaurantMembershipsService } from './restaurant-memberships.service';
import { restaurantInvitationActionSchema } from './restaurant-memberships.schemas';
import {
    type AcceptRestaurantInvitationInput,
    type AcceptRestaurantInvitationResult,
    type DeclineRestaurantInvitationInput,
    type DeclineRestaurantInvitationResult,
} from './restaurant-memberships.types';

@Controller('restaurant-membership')
export class RestaurantMembershipsController {
    constructor(
        private readonly restaurantMembershipsService: RestaurantMembershipsService,
    ) { }

    @Post('accept-invitation')
    @UseGuards(JwtAuthGuard)
    async acceptInvitation(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Body(new ZodValidationPipe(restaurantInvitationActionSchema))
        body: AcceptRestaurantInvitationInput,
    ): Promise<AcceptRestaurantInvitationResult> {
        return this.restaurantMembershipsService.acceptInvitation({
            userId,
            restaurantId: body.restaurantId,
        });
    }

    @Post('decline-invitation')
    @UseGuards(JwtAuthGuard)
    async declineInvitation(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Body(new ZodValidationPipe(restaurantInvitationActionSchema))
        body: DeclineRestaurantInvitationInput,
    ): Promise<DeclineRestaurantInvitationResult> {
        return this.restaurantMembershipsService.declineInvitation({
            userId,
            restaurantId: body.restaurantId,
        });
    }
}
