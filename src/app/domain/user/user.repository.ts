export interface User {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    picture?: string | null;
    googleId?: string | null;
}

export interface CreateGoogleUserInput {
    email: string;
    firstName?: string;
    lastName?: string;
    picture?: string;
    googleId: string;
}

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    createFromGoogle(data: CreateGoogleUserInput): Promise<User>;
}