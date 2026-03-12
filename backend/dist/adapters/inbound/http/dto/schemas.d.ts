import { z } from 'zod';
export declare const setBaselineSchema: z.ZodObject<{
    params: z.ZodObject<{
        routeId: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        routeId: string;
    }, {
        routeId: string;
    }>;
}, "strip", z.ZodTypeAny, {
    params: {
        routeId: string;
    };
}, {
    params: {
        routeId: string;
    };
}>;
export declare const getCbSchema: z.ZodObject<{
    query: z.ZodObject<{
        shipId: z.ZodString;
        year: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        shipId: string;
        year: number;
    }, {
        shipId: string;
        year: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        shipId: string;
        year: number;
    };
}, {
    query: {
        shipId: string;
        year: string;
    };
}>;
export declare const getAdjustedCbSchema: z.ZodObject<{
    query: z.ZodObject<{
        shipId: z.ZodString;
        year: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        shipId: string;
        year: number;
    }, {
        shipId: string;
        year: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        shipId: string;
        year: number;
    };
}, {
    query: {
        shipId: string;
        year: string;
    };
}>;
export declare const getBankingRecordsSchema: z.ZodObject<{
    query: z.ZodObject<{
        shipId: z.ZodString;
        year: z.ZodEffects<z.ZodString, number, string>;
    }, "strip", z.ZodTypeAny, {
        shipId: string;
        year: number;
    }, {
        shipId: string;
        year: string;
    }>;
}, "strip", z.ZodTypeAny, {
    query: {
        shipId: string;
        year: number;
    };
}, {
    query: {
        shipId: string;
        year: string;
    };
}>;
export declare const bankSurplusSchema: z.ZodObject<{
    body: z.ZodObject<{
        shipId: z.ZodString;
        year: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        shipId: string;
        year: number;
    }, {
        shipId: string;
        year: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        shipId: string;
        year: number;
    };
}, {
    body: {
        shipId: string;
        year: number;
    };
}>;
export declare const applyBankedSchema: z.ZodObject<{
    body: z.ZodObject<{
        shipId: z.ZodString;
        year: z.ZodNumber;
        amount: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        shipId: string;
        year: number;
        amount: number;
    }, {
        shipId: string;
        year: number;
        amount: number;
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        shipId: string;
        year: number;
        amount: number;
    };
}, {
    body: {
        shipId: string;
        year: number;
        amount: number;
    };
}>;
export declare const createPoolSchema: z.ZodObject<{
    body: z.ZodObject<{
        year: z.ZodNumber;
        members: z.ZodArray<z.ZodObject<{
            shipId: z.ZodString;
            allocationCb: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            shipId: string;
            allocationCb: number;
        }, {
            shipId: string;
            allocationCb: number;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        year: number;
        members: {
            shipId: string;
            allocationCb: number;
        }[];
    }, {
        year: number;
        members: {
            shipId: string;
            allocationCb: number;
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    body: {
        year: number;
        members: {
            shipId: string;
            allocationCb: number;
        }[];
    };
}, {
    body: {
        year: number;
        members: {
            shipId: string;
            allocationCb: number;
        }[];
    };
}>;
//# sourceMappingURL=schemas.d.ts.map