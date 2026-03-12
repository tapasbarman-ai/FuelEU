import { z } from 'zod';

export const setBaselineSchema = z.object({
    params: z.object({
        routeId: z.string().min(1),
    }),
});

export const getCbSchema = z.object({
    query: z.object({
        shipId: z.string().min(1),
        year: z.string().regex(/^\d{4}$/).transform(Number),
    }),
});

export const getAdjustedCbSchema = z.object({
    query: z.object({
        shipId: z.string().min(1),
        year: z.string().regex(/^\d{4}$/).transform(Number),
    }),
});

export const getBankingRecordsSchema = z.object({
    query: z.object({
        shipId: z.string().min(1),
        year: z.string().regex(/^\d{4}$/).transform(Number),
    }),
});

export const bankSurplusSchema = z.object({
    body: z.object({
        shipId: z.string().min(1),
        year: z.number().int().min(2024),
    }),
});

export const applyBankedSchema = z.object({
    body: z.object({
        shipId: z.string().min(1),
        year: z.number().int().min(2024),
        amount: z.number().positive(),
    }),
});

export const createPoolSchema = z.object({
    body: z.object({
        year: z.number().int().min(2024),
        members: z.array(z.object({
            shipId: z.string().min(1),
        })).min(1),
    }),
});
