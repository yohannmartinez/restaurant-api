import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'src/common/prisma/generated/client';
import { type PrismaClientOrTransaction } from 'src/common/prisma/prisma.types';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(
        id: string,
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<User | null> {
        return client.user.findUnique({
            where: { id },
        });
    }

    async findByEmail(
        email: string,
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<User | null> {
        return client.user.findUnique({
            where: { email },
        });
    }

    async create(
        data: Prisma.UserCreateInput,
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<User> {
        return client.user.create({
            data,
        });
    }

    async updateHashedRefreshToken(
        userId: string,
        hashedRefreshToken: string | null,
        client: PrismaClientOrTransaction = this.prisma,
    ): Promise<void> {
        await client.user.update({
            where: { id: userId },
            data: {
                hashedRefreshToken,
            },
        });
    }
}
