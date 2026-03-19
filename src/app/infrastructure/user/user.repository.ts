import { Injectable } from '@nestjs/common';
import {
    CreateGoogleUserInput,
    User,
    UserRepository,
} from '../../domain/user/user.repository';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async createFromGoogle(data: CreateGoogleUserInput): Promise<User> {
        return this.prisma.user.create({
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                picture: data.picture,
                googleId: data.googleId,
            },
        });
    }

    async updateRefreshToken(userId: string, hashedRefreshToken: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { hashedRefreshToken },
        });
    }

    async findById(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
        });
    }
}