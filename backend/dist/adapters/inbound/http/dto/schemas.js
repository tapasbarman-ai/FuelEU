"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoolSchema = exports.applyBankedSchema = exports.bankSurplusSchema = exports.getBankingRecordsSchema = exports.getAdjustedCbSchema = exports.getCbSchema = exports.setBaselineSchema = void 0;
const zod_1 = require("zod");
exports.setBaselineSchema = zod_1.z.object({
    params: zod_1.z.object({
        routeId: zod_1.z.string().min(1),
    }),
});
exports.getCbSchema = zod_1.z.object({
    query: zod_1.z.object({
        shipId: zod_1.z.string().min(1),
        year: zod_1.z.string().regex(/^\d{4}$/).transform(Number),
    }),
});
exports.getAdjustedCbSchema = zod_1.z.object({
    query: zod_1.z.object({
        shipId: zod_1.z.string().min(1),
        year: zod_1.z.string().regex(/^\d{4}$/).transform(Number),
    }),
});
exports.getBankingRecordsSchema = zod_1.z.object({
    query: zod_1.z.object({
        shipId: zod_1.z.string().min(1),
        year: zod_1.z.string().regex(/^\d{4}$/).transform(Number),
    }),
});
exports.bankSurplusSchema = zod_1.z.object({
    body: zod_1.z.object({
        shipId: zod_1.z.string().min(1),
        year: zod_1.z.number().int().min(2024),
    }),
});
exports.applyBankedSchema = zod_1.z.object({
    body: zod_1.z.object({
        shipId: zod_1.z.string().min(1),
        year: zod_1.z.number().int().min(2024),
        amount: zod_1.z.number().positive(),
    }),
});
exports.createPoolSchema = zod_1.z.object({
    body: zod_1.z.object({
        year: zod_1.z.number().int().min(2024),
        members: zod_1.z.array(zod_1.z.object({
            shipId: zod_1.z.string().min(1),
        })).min(1),
    }),
});
//# sourceMappingURL=schemas.js.map