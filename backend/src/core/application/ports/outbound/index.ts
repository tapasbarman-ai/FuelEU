import { Route } from '../../../domain/entities';

export interface IRouteRepository {
    findAll(): Promise<Route[]>;
    findById(id: string): Promise<Route | null>;
    findByRouteId(routeId: string): Promise<Route | null>;
    findBaseline(): Promise<Route | null>;
    clearBaseline(): Promise<void>;
    setBaseline(routeId: string): Promise<Route>;
}

export interface IComplianceRepository {
    findByShipAndYear(shipId: string, year: number): Promise<{ id: string; shipId: string; year: number; cbGco2eq: number; createdAt: Date } | null>;
    upsert(shipId: string, year: number, cbGco2eq: number): Promise<{ id: string; shipId: string; year: number; cbGco2eq: number; createdAt: Date }>;
}

export interface IBankEntryRepository {
    findByShipAndYear(shipId: string, year: number): Promise<{ id: string; shipId: string; year: number; amountGco2eq: number; createdAt: Date }[]>;
    create(shipId: string, year: number, amountGco2eq: number): Promise<{ id: string; shipId: string; year: number; amountGco2eq: number; createdAt: Date }>;
    sumByShipAndYear(shipId: string, year: number): Promise<number>;
}

export interface IPoolRepository {
    create(year: number, members: Array<{ shipId: string; cbBefore: number; cbAfter: number }>): Promise<{
        id: string;
        year: number;
        createdAt: Date;
        members: Array<{ id: string; poolId: string; shipId: string; cbBefore: number; cbAfter: number }>;
    }>;
}
