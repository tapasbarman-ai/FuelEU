import { useState } from 'react';
import { bankingApi, complianceApi } from '../../infrastructure/api';

export function useBanking() {
    const [records, setRecords] = useState<{ id: string; year: number; createdAt: string; amountGco2eq: number }[]>([]);
    const [cbData, setCbData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<{ code: string; message: string } | null>(null);

    const fetchData = async (shipId: string, year: number) => {
        setLoading(true);
        setError(null);
        try {
            const recs = await bankingApi.getRecords(shipId, year);
            setRecords(recs);
            const cb = await complianceApi.getCb(shipId, year);
            const adjCb = await complianceApi.getAdjustedCb(shipId, year);
            setCbData({ cb: cb.cb, surplus: cb.surplus, adjustedCb: adjCb.adjustedCb });
        } catch (err: any) {
            setError({ code: err.code || 'ERROR', message: err.message || 'Failed to fetch' });
        } finally {
            setLoading(false);
        }
    };

    const bankSurplus = async (shipId: string, year: number) => {
        setError(null);
        try {
            await bankingApi.bankSurplus(shipId, year);
            await fetchData(shipId, year);
        } catch (err: any) {
            setError({ code: err.code || 'ERROR', message: err.message || 'Failed to bank surplus' });
        }
    };

    const applyBanked = async (shipId: string, year: number, amount: number) => {
        setError(null);
        try {
            await bankingApi.applyBanked(shipId, year, amount);
            await fetchData(shipId, year);
        } catch (err: any) {
            setError({ code: err.code || 'ERROR', message: err.message || 'Failed to apply banked' });
        }
    };

    return { records, cbData, loading, error, fetchData, bankSurplus, applyBanked };
}
