export interface AuthenticatedUser {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    picture?: string | null;
}
