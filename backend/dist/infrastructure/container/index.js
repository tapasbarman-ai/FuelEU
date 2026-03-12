"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const client_1 = require("@prisma/client");
const PrismaRouteRepo_1 = require("../../adapters/outbound/postgres/repositories/PrismaRouteRepo");
const PrismaComplianceRepo_1 = require("../../adapters/outbound/postgres/repositories/PrismaComplianceRepo");
const PrismaBankEntryRepo_1 = require("../../adapters/outbound/postgres/repositories/PrismaBankEntryRepo");
const PrismaPoolRepo_1 = require("../../adapters/outbound/postgres/repositories/PrismaPoolRepo");
const RouteService_1 = require("../../core/application/use-cases/RouteService");
const ComplianceService_1 = require("../../core/application/use-cases/ComplianceService");
const BankingService_1 = require("../../core/application/use-cases/BankingService");
const PoolService_1 = require("../../core/application/use-cases/PoolService");
const MockRouteRepo_1 = require("../../adapters/outbound/mock/MockRouteRepo");
const MockComplianceRepo_1 = require("../../adapters/outbound/mock/MockComplianceRepo");
const MockBankEntryRepo_1 = require("../../adapters/outbound/mock/MockBankEntryRepo");
const MockPoolRepo_1 = require("../../adapters/outbound/mock/MockPoolRepo");
class Container {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        const useMock = process.env.USE_MOCK_DATA === 'true';
        if (useMock) {
            console.log('Using Mock Data Mode');
            this.routeRepo = new MockRouteRepo_1.MockRouteRepo();
            this.complianceRepo = new MockComplianceRepo_1.MockComplianceRepo();
            this.bankEntryRepo = new MockBankEntryRepo_1.MockBankEntryRepo();
            this.poolRepo = new MockPoolRepo_1.MockPoolRepo();
        }
        else {
            console.log('Using Prisma Data Mode');
            this.routeRepo = new PrismaRouteRepo_1.PrismaRouteRepo(this.prisma);
            this.complianceRepo = new PrismaComplianceRepo_1.PrismaComplianceRepo(this.prisma);
            this.bankEntryRepo = new PrismaBankEntryRepo_1.PrismaBankEntryRepo(this.prisma);
            this.poolRepo = new PrismaPoolRepo_1.PrismaPoolRepo(this.prisma);
        }
        // Init Services
        this.routeService = new RouteService_1.RouteService(this.routeRepo);
        this.complianceService = new ComplianceService_1.ComplianceService(this.complianceRepo, this.routeRepo, this.bankEntryRepo);
        this.bankingService = new BankingService_1.BankingService(this.bankEntryRepo, this.complianceService);
        this.poolService = new PoolService_1.PoolService(this.poolRepo, this.complianceService);
    }
    async destroy() {
        await this.prisma.$disconnect();
    }
}
exports.container = new Container();
//# sourceMappingURL=index.js.map