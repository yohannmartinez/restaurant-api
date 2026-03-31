import { Module } from '@nestjs/common';
import { RestaurantMembershipsModule } from '../restaurant-memberships/restaurant-memberships.module';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsRepository } from './restaurants.repository';
import { RestaurantsService } from './restaurants.service';

@Module({
    imports: [RestaurantMembershipsModule],
    controllers: [RestaurantsController],
    providers: [RestaurantsService, RestaurantsRepository],
    exports: [RestaurantsService],
})
export class RestaurantsModule { }
