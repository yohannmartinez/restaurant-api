import { Prisma } from './generated/client';
import { PrismaService } from './prisma.service';

export type PrismaClientOrTransaction = PrismaService | Prisma.TransactionClient;
