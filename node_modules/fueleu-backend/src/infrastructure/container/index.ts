import { PrismaClient } from '@prisma/client';
import { PrismaRouteRepo } from '../../adapters/outbound/postgres/repositories/PrismaRouteRepo';
import { PrismaComplianceRepo } from '../../adapters/outbound/postgres/repositories/PrismaComplianceRepo';
import { PrismaBankEntryRepo } from '../../adapters/outbound/postgres/repositories/PrismaBankEntryRepo';
import { PrismaPoolRepo } from '../../adapters/outbound/postgres/repositories/PrismaPoolRepo';

import { RouteService } from '../../core/application/use-cases/RouteService';
import { ComplianceService } from '../../core/application/use-cases/ComplianceService';
import { BankingService } from '../../core/application/use-cases/BankingService';
import { PoolService } from '../../core/application/use-cases/PoolService';

class Container {
    public readonly prisma: PrismaClient;

    // Repositories
    public readonly routeRepo: PrismaRouteRepo;
    public readonly complianceRepo: PrismaComplianceRepo;
    public readonly bankEntryRepo: PrismaBankEntryRepo;
    public readonly poolRepo: PrismaPoolRepo;

    // Services
    public readonly routeService: RouteService;
    public readonly complianceService: ComplianceService;
    public readonly bankingService: BankingService;
    public readonly poolService: PoolService;

    constructor() {
        this.prisma = new PrismaClient();

        // Init Repos
        this.routeRepo = new PrismaRouteRepo(this.prisma);
        this.complianceRepo = new PrismaComplianceRepo(this.prisma);
        this.bankEntryRepo = new PrismaBankEntryRepo(this.prisma);
        this.poolRepo = new PrismaPoolRepo(this.prisma);

        // Init Services
        this.routeService = new RouteService(this.routeRepo);
        this.complianceService = new ComplianceService(this.complianceRepo, this.routeRepo, this.bankEntryRepo);
        this.bankingService = new BankingService(this.bankEntryRepo, this.complianceService);
        this.poolService = new PoolService(this.poolRepo, this.complianceService);
    }

    async destroy() {
        await this.prisma.$disconnect();
    }
}

export const container = new Container();
