import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AccountsModule } from '../accounts/accounts.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { GoogleStrategy } from './strategies/providers/google.strategy';
import { GoogleAuthGuard } from './guards/providers/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@Module({
    imports: [
        JwtModule.register({}),
        UsersModule,
        AccountsModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        RefreshTokenStrategy,
        GoogleStrategy,
        GoogleAuthGuard,
        JwtAuthGuard,
        RefreshTokenGuard,
    ],
    exports: [AuthService],
})
export class AuthModule { }