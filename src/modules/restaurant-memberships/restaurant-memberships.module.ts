import { Module } from '@nestjs/common';
import { RestaurantMembershipsRepository } from './restaurant-memberships.repository';
import { RestaurantMembershipsService } from './restaurant-memberships.service';

@Module({
    providers: [RestaurantMembershipsService, RestaurantMembershipsRepository],
    exports: [RestaurantMembershipsService],
})
export class RestaurantMembershipsModule { }
