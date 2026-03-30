import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
    Account,
    AccountProviders,
} from 'src/common/prisma/generated/client';

@Injectable()
export class AccountsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByProviderAndProviderAccountId(
        provider: AccountProviders,
        providerAccountId: string,
    ): Promise<Account | null> {
        return this.prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId,
                },
            },
        });
    }

    async findUserByProviderAndProviderAccountId(
        provider: AccountProviders,
        providerAccountId: string,
    ) {
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

    async findByUserIdAndProvider(params: {
        userId: string;
        provider: AccountProviders;
    }): Promise<Account | null> {
        return this.prisma.account.findUnique({
            where: {
                userId_provider: {
                    userId: params.userId,
                    provider: params.provider,
                },
            },
        });
    }

    async create(params: {
        userId: string;
        provider: AccountProviders;
        providerAccountId: string;
    }): Promise<Account> {
        return this.prisma.account.create({
            data: {
                userId: params.userId,
                provider: params.provider,
                providerAccountId: params.providerAccountId,
            },
        });
    }
}