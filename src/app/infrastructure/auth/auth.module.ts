import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { GoogleStrategy } from './providers/google/google.strategy';
import { AuthController } from './auth.controller';
import { PrismaUserRepository } from '../user/user.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleAuthController } from './providers/google/google.controller';
import { LoginWithOAuthProviderUseCase } from 'src/app/useCase/auth/provider/login.useCase';
import { RefreshSessionUseCase } from 'src/app/useCase/auth/session/refresh.useCase';
import { LogoutUseCase } from 'src/app/useCase/auth/session/logout.useCase';
import { USER_REPOSITORY } from 'src/app/domain/user/repository/user.repository';
import { AUTH_REPOSITORY } from 'src/app/domain/auth/repository/auth.repository';
import { AUTH_TOKEN_SERVICE } from 'src/app/domain/auth/service/authToken.service';
import { JwtAuthTokenService } from './services/jwtAuthToken.service';

@Module({
    imports: [
        PassportModule.register({ session: false }),
        JwtModule.register({}),
        PrismaModule,
    ],
    controllers: [AuthController, GoogleAuthController],
    providers: [
        GoogleStrategy,
        LoginWithOAuthProviderUseCase,
        RefreshSessionUseCase,
        LogoutUseCase,
        PrismaUserRepository,
        JwtAuthTokenService,
        {
            provide: USER_REPOSITORY,
            useExisting: PrismaUserRepository,
        },
        {
            provide: AUTH_REPOSITORY,
            useExisting: PrismaUserRepository,
        },
        {
            provide: AUTH_TOKEN_SERVICE,
            useExisting: JwtAuthTokenService,
        },
    ],
})
export class AuthModule { }
