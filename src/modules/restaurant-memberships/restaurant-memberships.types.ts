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

export type UpdateRestaurantMemberRoleInput = {
    restaurantId: string;
    userId: string;
    role: RestaurantRole;
};

export type UpdateRestaurantMemberRoleResult = RestaurantMembership;

export type RevokeRestaurantMemberInput = {
    restaurantId: string;
    userId: string;
};

export type RevokeRestaurantMemberResult = RestaurantMembership;

export type RestoreRestaurantMemberInput = {
    restaurantId: string;
    userId: string;
};

export type RestoreRestaurantMemberResult = RestaurantMembership;

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
