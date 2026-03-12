"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = validateSchema;
const zod_1 = require("zod");
const DomainError_1 = require("../../../../core/domain/errors/DomainError");
function validateSchema(schema) {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                next(new DomainError_1.ValidationError('Validation failed', error.errors));
            }
            else {
                next(error);
            }
        }
    };
}
//# sourceMappingURL=validateSchema.js.map