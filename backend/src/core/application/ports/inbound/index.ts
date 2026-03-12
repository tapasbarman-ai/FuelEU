import { Route } from '../../../domain/entities';

export interface ComparisonResult {
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    isBaseline: boolean;
    percentDiff: number | null;
    compliant: boolean;
}

export interface IRouteService {
    getAllRoutes(): Promise<Route[]>;
    setBaseline(routeId: string): Promise<{ success: boolean; routeId: string }>;
    getComparison(): Promise<ComparisonResult[]>;
}

export interface CBResult {
    shipId: string;
    year: number;
    cb: number;
    surplus: boolean;
}

export interface AdjustedCBResult {
    shipId: string;
    year: number;
    adjustedCb: number;
}

export interface IComplianceService {
    getCB(shipId: string, year: number): Promise<CBResult>;
    getAdjustedCB(shipId: string, year: number): Promise<AdjustedCBResult>;
}

export interface BankResult {
    bankEntryId: string;
    shipId: string;
    year: number;
    amountBanked: number;
}

export interface ApplyResult {
    applied: number;
    remainingBanked: number;
    newAdjustedCb: number;
}

export interface IBankingService {
    getRecords(shipId: string, year: number): Promise<{ id: string; shipId: string; year: number; amountGco2eq: number; createdAt: Date }[]>;
    bankSurplus(shipId: string, year: number): Promise<BankResult>;
    applyBanked(shipId: string, year: number, amount: number): Promise<ApplyResult>;
}

export interface PoolMemberInput {
    shipId: string;
    allocationCb: number;
}

export interface IPoolService {
    createPool(year: number, members: PoolMemberInput[]): Promise<{
        id: string;
        year: number;
        createdAt: Date;
        members: Array<{ id: string; poolId: string; shipId: string; cbBefore: number; cbAfter: number }>;
    }>;
}
