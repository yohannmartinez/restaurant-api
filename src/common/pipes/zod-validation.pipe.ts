import {
    BadRequestException,
    Injectable,
    type PipeTransform,
} from '@nestjs/common';
import { ZodError, type ZodType } from 'zod';

@Injectable()
export class ZodValidationPipe<TSchema extends ZodType>
    implements PipeTransform
{
    constructor(private readonly schema: TSchema) { }

    transform(value: unknown) {
        const result = this.schema.safeParse(value);

        if (!result.success) {
            throw new BadRequestException({
                message: 'Validation failed',
                errors: this.formatErrors(result.error),
            });
        }

        return result.data;
    }

    private formatErrors(error: ZodError) {
        return error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
        }));
    }
}
