import { useState } from 'react';
import { poolApi } from '../../infrastructure/api';
import { validatePool } from '../../../core/application/use-cases/validatePool';

export function usePooling() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ code: string; message: string } | null>(null);
    const [poolResult, setPoolResult] = useState<any>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const createPool = async (year: number, members: Array<{ shipId: string; allocationCb: number; currentCb: number }>) => {
        const vErrors = validatePool(members);
        if (vErrors.length > 0) {
            setValidationErrors(vErrors);
            return;
        }

        setValidationErrors([]);
        setLoading(true);
        setError(null);
        try {
            const payload = members.map(m => ({ shipId: m.shipId, allocationCb: m.allocationCb }));
            const result = await poolApi.createPool(year, payload);
            setPoolResult(result);
        } catch (err: any) {
            setError({ code: err.code || 'ERROR', message: err.message || 'Failed to create pool' });
        } finally {
            setLoading(false);
        }
    };

    return { createPool, loading, error, poolResult, validationErrors };
}
