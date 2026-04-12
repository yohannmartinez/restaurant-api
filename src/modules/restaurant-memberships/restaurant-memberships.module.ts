import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RestaurantMembershipsController } from './restaurant-memberships.controller';
import { RestaurantMembershipGuard } from './guards/restaurant-membership.guard';
import { RestaurantMembershipsRepository } from './restaurant-memberships.repository';
import { RestaurantMembershipsService } from './restaurant-memberships.service';

@Module({
    imports: [UsersModule],
    controllers: [RestaurantMembershipsController],
    providers: [
        RestaurantMembershipsService,
        RestaurantMembershipsRepository,
        RestaurantMembershipGuard,
    ],
    exports: [
        RestaurantMembershipsService,
        RestaurantMembershipsRepository,
        RestaurantMembershipGuard,
    ],
})
export class RestaurantMembershipsModule { }
