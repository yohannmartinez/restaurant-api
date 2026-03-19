import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { GoogleStrategy } from './strategies/google.strategy';
import { AuthController } from './auth.controller';
import { LoginWithGoogleUseCase } from 'src/app/useCase/auth/google/login.useCase';
import { PrismaUserRepository } from '../user/user.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleAuthController } from './controllers/google.controller';

@Module({
    imports: [
        PassportModule.register({ session: false }),
        JwtModule.register({}),
        PrismaModule,
    ],
    controllers: [AuthController, GoogleAuthController],
    providers: [
        GoogleStrategy,
        LoginWithGoogleUseCase,
        PrismaUserRepository
    ],
})
export class AuthModule { }