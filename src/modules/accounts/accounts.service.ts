import { Injectable } from '@nestjs/common';
import {
    Account,
    AccountProviders,
    User,
} from 'src/common/prisma/generated/client';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
    constructor(private readonly accountsRepository: AccountsRepository) { }

    async findUserByProviderAccount(
        provider: AccountProviders,
        providerAccountId: string,
    ): Promise<User | null> {
        return this.accountsRepository.findUserByProviderAndProviderAccountId(
            provider,
            providerAccountId,
        );
    }

    async findByUserIdAndProvider(params: {
        userId: string;
        provider: AccountProviders;
    }): Promise<Account | null> {
        return this.accountsRepository.findByUserIdAndProvider(params);
    }

    async linkProviderToUser(params: {
        userId: string;
        provider: AccountProviders;
        providerAccountId: string;
    }): Promise<Account> {
        return this.accountsRepository.create(params);
    }
}