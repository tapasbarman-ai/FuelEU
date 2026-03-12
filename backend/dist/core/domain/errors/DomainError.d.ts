export declare class DomainError extends Error {
    readonly code: string;
    readonly details?: unknown;
    constructor(code: string, message: string, details?: unknown);
}
export declare class ValidationError extends DomainError {
    constructor(message: string, details?: unknown);
}
export declare class NotFoundError extends DomainError {
    constructor(resource: string, id: string);
}
export declare class BusinessRuleError extends DomainError {
    constructor(code: string, message: string, details?: unknown);
}
//# sourceMappingURL=DomainError.d.ts.map