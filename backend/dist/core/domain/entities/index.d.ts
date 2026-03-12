export interface Route {
    id: string;
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
    isBaseline: boolean;
    createdAt: Date;
}
export interface ShipCompliance {
    id: string;
    shipId: string;
    year: number;
    cbGco2eq: number;
    createdAt: Date;
}
export interface BankEntry {
    id: string;
    shipId: string;
    year: number;
    amountGco2eq: number;
    createdAt: Date;
}
export interface Pool {
    id: string;
    year: number;
    createdAt: Date;
    members: PoolMember[];
}
export interface PoolMember {
    id: string;
    poolId: string;
    shipId: string;
    cbBefore: number;
    cbAfter: number;
}
//# sourceMappingURL=index.d.ts.map