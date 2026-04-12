import {
    MembershipStatus,
    RestaurantMembership,
    RestaurantRole,
} from 'src/common/prisma/generated/client';

export type RestaurantInvitationActionInput = {
    restaurantId: string;
};

export type AcceptRestaurantInvitationInput = RestaurantInvitationActionInput;

export type AcceptRestaurantInvitationResult = RestaurantMembership;

export type DeclineRestaurantInvitationInput = RestaurantInvitationActionInput;

export type DeclineRestaurantInvitationResult = RestaurantMembership;

export type RestaurantMemberProfile = {
    userId: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    picture: string | null;
    role: RestaurantRole;
    status: MembershipStatus;
    createdAt: Date;
};
