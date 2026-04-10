import { Module } from '@nestjs/common';
import { RestaurantMembershipsController } from './restaurant-memberships.controller';
import { RestaurantMembershipsRepository } from './restaurant-memberships.repository';
import { RestaurantMembershipsService } from './restaurant-memberships.service';

@Module({
    controllers: [RestaurantMembershipsController],
    providers: [RestaurantMembershipsService, RestaurantMembershipsRepository],
    exports: [RestaurantMembershipsService],
})
export class RestaurantMembershipsModule { }
