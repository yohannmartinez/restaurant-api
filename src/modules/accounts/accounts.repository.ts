import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
    Account,
    AccountProvider,
} from 'src/common/prisma/generated/client';
import { type PrismaClientOrTransaction } from 'src/common/prisma/prisma.types';

@Injectable()
export class AccountsRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByProviderAndProviderAccountId(
        provider: AccountProvider,
        providerAccountId: string,
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<Account | null> {
        return client.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider,
                    providerAccountId,
                },
            },
        });
    }

    async findUserByProviderAndProviderAccountId(
        provider: AccountProvider,
        providerAccountId: string,
        client: PrismaClientOrTransaction = this.prisma,
    ) {
        const account = await client.account.findUnique({
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
        provider: AccountProvider;
    }, client: PrismaClientOrTransaction = this.prisma): Promise<Account | null> {
        return client.account.findUnique({
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
        provider: AccountProvider;
        providerAccountId: string;
    }, client: PrismaClientOrTransaction = this.prisma): Promise<Account> {
        return client.account.create({
            data: {
                userId: params.userId,
                provider: params.provider,
                providerAccountId: params.providerAccountId,
            },
        });
    }
}
