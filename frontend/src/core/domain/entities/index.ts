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
    createdAt: string;
}

export interface ComplianceBalance {
    shipId: string;
    year: number;
    cb: number;
    surplus: boolean;
}

export interface BankRecord {
    id: string;
    shipId: string;
    year: number;
    amountGco2eq: number;
    createdAt: string;
}

export interface Pool {
    id: string;
    year: number;
    createdAt: string;
    members: Array<{
        id: string;
        poolId: string;
        shipId: string;
        cbBefore: number;
        cbAfter: number;
    }>;
}
