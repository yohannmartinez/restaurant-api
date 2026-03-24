import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'src/app/domain/user/model/user.model';
import { UserRepository } from 'src/app/domain/user/repository/user.repository';
import {
    AuthRepository,
    CreateUserWithAuthProviderInput,
    LinkAuthProviderInput,
} from 'src/app/domain/auth/repository/auth.repository';
import { AuthProvider } from 'src/app/domain/account/enum/account.enum';

@Injectable()
export class PrismaUserRepository implements UserRepository, AuthRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(userId: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }

    async findByProviderAccount(
        provider: AuthProvider,
        providerAccountId: string,
    ): Promise<User | null> {
        const account = await this.prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId,
                },
            },
            include: {
                user: true,
            },
        });

        return account?.user ?? null;
    }

    async createWithAuthProvider(
        data: CreateUserWithAuthProviderInput,
    ): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                picture: data.picture,
                accounts: {
                    create: {
                        provider: data.authProvider.provider,
                        providerAccountId: data.authProvider.providerAccountId,
                    },
                },
            },
        });
    }

    async linkAuthProvider(
        userId: string,
        data: LinkAuthProviderInput,
    ): Promise<void> {
        const existingAccount = await this.prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: data.provider,
                    providerAccountId: data.providerAccountId,
                },
            },
        });

        if (existingAccount) {
            return;
        }

        await this.prisma.account.create({
            data: {
                userId,
                provider: data.provider,
                providerAccountId: data.providerAccountId,
            },
        });
    }

    async updateRefreshToken(
        userId: string,
        hashedRefreshToken: string | null,
    ): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken },
        });
    }
}
