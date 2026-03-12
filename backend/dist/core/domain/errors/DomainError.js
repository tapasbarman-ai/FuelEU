"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessRuleError = exports.NotFoundError = exports.ValidationError = exports.DomainError = void 0;
class DomainError extends Error {
    constructor(code, message, details) {
        super(message);
        this.name = 'DomainError';
        this.code = code;
        this.details = details;
    }
}
exports.DomainError = DomainError;
class ValidationError extends DomainError {
    constructor(message, details) {
        super('VALIDATION_ERROR', message, details);
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends DomainError {
    constructor(resource, id) {
        super('NOT_FOUND', `${resource} with id '${id}' not found`);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class BusinessRuleError extends DomainError {
    constructor(code, message, details) {
        super(code, message, details);
        this.name = 'BusinessRuleError';
    }
}
exports.BusinessRuleError = BusinessRuleError;
//# sourceMappingURL=DomainError.js.map