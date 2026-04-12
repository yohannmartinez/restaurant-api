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
import {
    restaurantInvitationActionSchema,
    revokeRestaurantMemberSchema,
    restoreRestaurantMemberSchema,
    updateRestaurantMemberRoleSchema,
} from './restaurant-memberships.schemas';
import {
    type AcceptRestaurantInvitationInput,
    type AcceptRestaurantInvitationResult,
    type DeclineRestaurantInvitationInput,
    type DeclineRestaurantInvitationResult,
    type RevokeRestaurantMemberInput,
    type RevokeRestaurantMemberResult,
    type RestoreRestaurantMemberInput,
    type RestoreRestaurantMemberResult,
    type UpdateRestaurantMemberRoleInput,
    type UpdateRestaurantMemberRoleResult,
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

    @Post('update-role')
    @UseGuards(JwtAuthGuard)
    async updateRole(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Body(new ZodValidationPipe(updateRestaurantMemberRoleSchema))
        body: UpdateRestaurantMemberRoleInput,
    ): Promise<UpdateRestaurantMemberRoleResult> {
        return this.restaurantMembershipsService.updateMemberRole({
            currentUserId: userId,
            restaurantId: body.restaurantId,
            targetUserId: body.userId,
            role: body.role,
        });
    }

    @Post('revoke-member')
    @UseGuards(JwtAuthGuard)
    async revokeMember(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Body(new ZodValidationPipe(revokeRestaurantMemberSchema))
        body: RevokeRestaurantMemberInput,
    ): Promise<RevokeRestaurantMemberResult> {
        return this.restaurantMembershipsService.revokeMember({
            currentUserId: userId,
            restaurantId: body.restaurantId,
            targetUserId: body.userId,
        });
    }

    @Post('restore-member')
    @UseGuards(JwtAuthGuard)
    async restoreMember(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Body(new ZodValidationPipe(restoreRestaurantMemberSchema))
        body: RestoreRestaurantMemberInput,
    ): Promise<RestoreRestaurantMemberResult> {
        return this.restaurantMembershipsService.restoreMember({
            currentUserId: userId,
            restaurantId: body.restaurantId,
            targetUserId: body.userId,
        });
    }
}
