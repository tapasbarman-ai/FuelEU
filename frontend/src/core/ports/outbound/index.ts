export interface IRouteApiPort {
    getRoutes(): Promise<any[]>;
    setBaseline(routeId: string): Promise<{ success: boolean; routeId: string }>;
    getComparison(): Promise<any[]>;
}

export interface IComplianceApiPort {
    getCb(shipId: string, year: number): Promise<any>;
    getAdjustedCb(shipId: string, year: number): Promise<any>;
}

export interface IBankingApiPort {
    getRecords(shipId: string, year: number): Promise<any[]>;
    bankSurplus(shipId: string, year: number): Promise<any>;
    applyBanked(shipId: string, year: number, amount: number): Promise<any>;
}

export interface IPoolApiPort {
    createPool(year: number, members: Array<{ shipId: string }>): Promise<any>;
}
