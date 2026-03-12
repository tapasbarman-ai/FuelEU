import { IRouteService, ComparisonResult } from '../ports/inbound';
import { IRouteRepository } from '../ports/outbound';
export declare class RouteService implements IRouteService {
    private readonly routeRepo;
    constructor(routeRepo: IRouteRepository);
    getAllRoutes(): Promise<import("../../domain/entities").Route[]>;
    setBaseline(routeId: string): Promise<{
        success: boolean;
        routeId: string;
    }>;
    getComparison(): Promise<ComparisonResult[]>;
}
//# sourceMappingURL=RouteService.d.ts.map