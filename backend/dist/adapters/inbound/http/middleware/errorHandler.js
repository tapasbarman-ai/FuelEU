"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const DomainError_1 = require("../../../../core/domain/errors/DomainError");
function errorHandler(err, req, res, next) {
    if (err instanceof DomainError_1.DomainError) {
        let status = 400;
        if (err.name === 'ValidationError' || err.name === 'BusinessRuleError') {
            status = 422;
        }
        else if (err.name === 'NotFoundError') {
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
//# sourceMappingURL=errorHandler.js.map