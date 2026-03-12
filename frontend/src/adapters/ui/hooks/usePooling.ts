import { useState } from 'react';
import { poolApi } from '../../infrastructure/api';

export function usePooling() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ code: string; message: string } | null>(null);
    const [poolResult, setPoolResult] = useState<any>(null);

    const createPool = async (year: number, members: Array<{ shipId: string }>) => {
        setLoading(true);
        setError(null);
        try {
            const result = await poolApi.createPool(year, members);
            setPoolResult(result);
        } catch (err: any) {
            setError({ code: err.code || 'ERROR', message: err.message || 'Failed to create pool' });
        } finally {
            setLoading(false);
        }
    };

    return { createPool, loading, error, poolResult };
}
