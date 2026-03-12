import { IComplianceService, CBResult, AdjustedCBResult } from '../ports/inbound';
import { IComplianceRepository, IBankEntryRepository, IRouteRepository } from '../ports/outbound';
export declare class ComplianceService implements IComplianceService {
    private readonly complianceRepo;
    private readonly routeRepo;
    private readonly bankRepo;
    constructor(complianceRepo: IComplianceRepository, routeRepo: IRouteRepository, bankRepo: IBankEntryRepository);
    getCB(shipId: string, year: number): Promise<CBResult>;
    getAdjustedCB(shipId: string, year: number): Promise<AdjustedCBResult>;
}
//# sourceMappingURL=ComplianceService.d.ts.map