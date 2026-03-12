export class DomainError extends Error {
    public readonly code: string;
    public readonly details?: unknown;

    constructor(code: string, message: string, details?: unknown) {
        super(message);
        this.name = 'DomainError';
        this.code = code;
        this.details = details;
    }
}

export class ValidationError extends DomainError {
    constructor(message: string, details?: unknown) {
        super('VALIDATION_ERROR', message, details);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends DomainError {
    constructor(resource: string, id: string) {
        super('NOT_FOUND', `${resource} with id '${id}' not found`);
        this.name = 'NotFoundError';
    }
}

export class BusinessRuleError extends DomainError {
    constructor(code: string, message: string, details?: unknown) {
        super(code, message, details);
        this.name = 'BusinessRuleError';
    }
}
