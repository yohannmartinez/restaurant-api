import { Module } from '@nestjs/common';
import { GracefulShutdownModule } from 'nestjs-graceful-shutdown';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { AuthModule } from './modules/auth/auth.module';
import { RestaurantMembershipsModule } from './modules/restaurant-memberships/restaurant-memberships.module';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';

@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GracefulShutdownModule.forRoot(),
    PrismaModule,
    UsersModule,
    AccountsModule,
    AuthModule,
    RestaurantMembershipsModule,
    RestaurantsModule,
  ],
})
export class AppModule { }
