import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from 'src/common/prisma/generated/client';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) { }

    async findById(userId: string): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findByEmail(email);
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.usersRepository.create(data);
    }

    async updateHashedRefreshToken(
        userId: string,
        hashedRefreshToken: string | null,
    ): Promise<void> {
        await this.usersRepository.updateHashedRefreshToken(
            userId,
            hashedRefreshToken,
        );
    }
}