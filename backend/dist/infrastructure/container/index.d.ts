import { PrismaClient } from '@prisma/client';
import { RouteService } from '../../core/application/use-cases/RouteService';
import { ComplianceService } from '../../core/application/use-cases/ComplianceService';
import { BankingService } from '../../core/application/use-cases/BankingService';
import { PoolService } from '../../core/application/use-cases/PoolService';
import { IRouteRepository, IComplianceRepository, IBankEntryRepository, IPoolRepository } from '../../core/application/ports/outbound';
declare class Container {
    readonly prisma: PrismaClient;
    readonly routeRepo: IRouteRepository;
    readonly complianceRepo: IComplianceRepository;
    readonly bankEntryRepo: IBankEntryRepository;
    readonly poolRepo: IPoolRepository;
    readonly routeService: RouteService;
    readonly complianceService: ComplianceService;
    readonly bankingService: BankingService;
    readonly poolService: PoolService;
    constructor();
    destroy(): Promise<void>;
}
export declare const container: Container;
export {};
//# sourceMappingURL=index.d.ts.map