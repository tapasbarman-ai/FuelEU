import { useState } from 'react';
import { routeApi } from '../../infrastructure/api';

export function useRoutes() {
    const [routes, setRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoutes = async () => {
        setLoading(true);
        try {
            const data = await routeApi.getRoutes();
            setRoutes(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch routes');
        } finally {
            setLoading(false);
        }
    };

    const setBaseline = async (routeId: string) => {
        try {
            await routeApi.setBaseline(routeId);
            await fetchRoutes();
        } catch (err: any) {
            setError(err.message || 'Failed to set baseline');
        }
    };

    return { routes, loading, error, fetchRoutes, setBaseline };
}
