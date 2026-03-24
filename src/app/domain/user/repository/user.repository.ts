import { User } from '../model/user.model';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(userId: string): Promise<User | null>;
}
