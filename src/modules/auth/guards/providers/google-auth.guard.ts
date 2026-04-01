import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { encodeRedirectPath } from '../../helpers/auth-redirect.utils';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    override getAuthenticateOptions(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<{
            query?: { redirect_path?: string | string[] };
        }>();
        const redirectPath = request.query?.redirect_path;

        if (typeof redirectPath !== 'string' || redirectPath.trim().length === 0) {
            return undefined;
        }

        const state = encodeRedirectPath(redirectPath);

        if (!state) {
            return undefined;
        }

        return {
            state,
        };
    }
}
