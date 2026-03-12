import { PrismaClient } from '@prisma/client';
import { PrismaRouteRepo } from '../../adapters/outbound/postgres/repositories/PrismaRouteRepo';
import { PrismaComplianceRepo } from '../../adapters/outbound/postgres/repositories/PrismaComplianceRepo';
import { PrismaBankEntryRepo } from '../../adapters/outbound/postgres/repositories/PrismaBankEntryRepo';
import { PrismaPoolRepo } from '../../adapters/outbound/postgres/repositories/PrismaPoolRepo';
import { RouteService } from '../../core/application/use-cases/RouteService';
import { ComplianceService } from '../../core/application/use-cases/ComplianceService';
import { BankingService } from '../../core/application/use-cases/BankingService';
import { PoolService } from '../../core/application/use-cases/PoolService';
declare class Container {
    readonly prisma: PrismaClient;
    readonly routeRepo: PrismaRouteRepo;
    readonly complianceRepo: PrismaComplianceRepo;
    readonly bankEntryRepo: PrismaBankEntryRepo;
    readonly poolRepo: PrismaPoolRepo;
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