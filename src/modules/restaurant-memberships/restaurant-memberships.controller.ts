import {
    Body,
    Controller,
    Post,
    UseGuards,
} from '@nestjs/common';
import { RestaurantRole } from 'src/common/prisma/generated/client';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { authUserIdSchema } from '../auth/auth.schemas';
import { CurrentUserId } from '../auth/decorators/current-user-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequireRestaurantRole } from './decorators/require-restaurant-role.decorator';
import { RestaurantMembershipGuard } from './guards/restaurant-membership.guard';
import { RestaurantMembershipsService } from './restaurant-memberships.service';
import {
    restaurantInvitationActionSchema,
    inviteRestaurantMemberSchema,
    revokeRestaurantMemberSchema,
    restoreRestaurantMemberSchema,
    updateRestaurantMemberRoleSchema,
} from './restaurant-memberships.schemas';
import {
    type AcceptRestaurantInvitationInput,
    type AcceptRestaurantInvitationResult,
    type DeclineRestaurantInvitationInput,
    type DeclineRestaurantInvitationResult,
    type InviteRestaurantMemberInput,
    type InviteRestaurantMemberResult,
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

    @Post('invite')
    @RequireRestaurantRole(RestaurantRole.OWNER)
    @UseGuards(JwtAuthGuard, RestaurantMembershipGuard)
    async inviteMember(
        @CurrentUserId(new ZodValidationPipe(authUserIdSchema))
        userId: string,
        @Body(new ZodValidationPipe(inviteRestaurantMemberSchema))
        body: InviteRestaurantMemberInput,
    ): Promise<InviteRestaurantMemberResult> {
        return this.restaurantMembershipsService.inviteMember({
            inviterUserId: userId,
            targetUserEmail: body.email,
            restaurantId: body.restaurantId,
            role: body.role,
        });
    }

    @Post('update-role')
    @RequireRestaurantRole(RestaurantRole.OWNER)
    @UseGuards(JwtAuthGuard, RestaurantMembershipGuard)
    async updateRole(
        @Body(new ZodValidationPipe(updateRestaurantMemberRoleSchema))
        body: UpdateRestaurantMemberRoleInput,
    ): Promise<UpdateRestaurantMemberRoleResult> {
        return this.restaurantMembershipsService.updateMemberRole({
            restaurantId: body.restaurantId,
            targetUserId: body.userId,
            role: body.role,
        });
    }

    @Post('revoke-member')
    @RequireRestaurantRole(RestaurantRole.OWNER)
    @UseGuards(JwtAuthGuard, RestaurantMembershipGuard)
    async revokeMember(
        @Body(new ZodValidationPipe(revokeRestaurantMemberSchema))
        body: RevokeRestaurantMemberInput,
    ): Promise<RevokeRestaurantMemberResult> {
        return this.restaurantMembershipsService.revokeMember({
            restaurantId: body.restaurantId,
            targetUserId: body.userId,
        });
    }

    @Post('restore-member')
    @RequireRestaurantRole(RestaurantRole.OWNER)
    @UseGuards(JwtAuthGuard, RestaurantMembershipGuard)
    async restoreMember(
        @Body(new ZodValidationPipe(restoreRestaurantMemberSchema))
        body: RestoreRestaurantMemberInput,
    ): Promise<RestoreRestaurantMemberResult> {
        return this.restaurantMembershipsService.restoreMember({
            restaurantId: body.restaurantId,
            targetUserId: body.userId,
        });
    }
}
