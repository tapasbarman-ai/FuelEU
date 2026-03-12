import { useState } from 'react';
import { routeApi } from '../../infrastructure/api';

export function useComparison() {
    const [comparison, setComparison] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchComparison = async () => {
        setLoading(true);
        try {
            const data = await routeApi.getComparison();
            setComparison(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch comparison');
        } finally {
            setLoading(false);
        }
    };

    return { comparison, loading, error, fetchComparison };
}
