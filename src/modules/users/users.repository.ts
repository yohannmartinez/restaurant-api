import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'src/common/prisma/generated/client';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async updateHashedRefreshToken(
        userId: string,
        hashedRefreshToken: string | null,
    ): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                hashedRefreshToken,
            },
        });
    }
}