import { apiClient } from './client';
import { IRouteApiPort, IComplianceApiPort, IBankingApiPort, IPoolApiPort } from '../../../core/ports/outbound';

export const routeApi: IRouteApiPort = {
    getRoutes: async () => (await apiClient.get('/routes')).data,
    setBaseline: async (routeId: string) => (await apiClient.post(`/routes/${routeId}/baseline`)).data,
    getComparison: async () => (await apiClient.get('/routes/comparison')).data,
};

export const complianceApi: IComplianceApiPort = {
    getCb: async (shipId: string, year: number) => (await apiClient.get('/compliance/cb', { params: { shipId, year } })).data,
    getAdjustedCb: async (shipId: string, year: number) => (await apiClient.get('/compliance/adjusted-cb', { params: { shipId, year } })).data,
};

export const bankingApi: IBankingApiPort = {
    getRecords: async (shipId: string, year: number) => (await apiClient.get('/banking/records', { params: { shipId, year } })).data,
    bankSurplus: async (shipId: string, year: number) => (await apiClient.post('/banking/bank', { shipId, year })).data,
    applyBanked: async (shipId: string, year: number, amount: number) => (await apiClient.post('/banking/apply', { shipId, year, amount })).data,
};

export const poolApi: IPoolApiPort = {
    createPool: async (year: number, members: Array<{ shipId: string; allocationCb: number }>) =>
        (await apiClient.post('/pools', { year, members })).data,
};
