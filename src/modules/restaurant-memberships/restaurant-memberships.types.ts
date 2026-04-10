import { RestaurantMembership } from 'src/common/prisma/generated/client';

export type RestaurantInvitationActionInput = {
    restaurantId: string;
};

export type AcceptRestaurantInvitationInput = RestaurantInvitationActionInput;

export type AcceptRestaurantInvitationResult = RestaurantMembership;

export type DeclineRestaurantInvitationInput = RestaurantInvitationActionInput;

export type DeclineRestaurantInvitationResult = RestaurantMembership;
