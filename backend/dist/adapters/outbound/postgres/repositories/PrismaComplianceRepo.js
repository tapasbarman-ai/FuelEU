"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaComplianceRepo = void 0;
class PrismaComplianceRepo {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByShipAndYear(shipId, year) {
        return this.prisma.shipCompliance.findUnique({
            where: { shipId_year: { shipId, year } },
        });
    }
    async upsert(shipId, year, cbGco2eq) {
        return this.prisma.shipCompliance.upsert({
            where: { shipId_year: { shipId, year } },
            update: { cbGco2eq },
            create: { shipId, year, cbGco2eq },
        });
    }
}
exports.PrismaComplianceRepo = PrismaComplianceRepo;
//# sourceMappingURL=PrismaComplianceRepo.js.map