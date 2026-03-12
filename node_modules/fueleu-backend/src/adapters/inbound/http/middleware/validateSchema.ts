import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../../../core/domain/errors/DomainError';

export function validateSchema(schema: AnyZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                next(new ValidationError('Validation failed', error.errors));
            } else {
                next(error);
            }
        }
    };
}
