import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../../core/domain/errors/DomainError';

export function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof DomainError) {
        let status = 400;

        if (err.name === 'ValidationError' || err.name === 'BusinessRuleError') {
            status = 422;
        } else if (err.name === 'NotFoundError') {
            status = 404;
        }

        res.status(status).json({
            code: err.code,
            message: err.message,
            details: err.details,
        });
        return;
    }

    console.error('[Unhandled Error]', err);
    res.status(500).json({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
    });
}
