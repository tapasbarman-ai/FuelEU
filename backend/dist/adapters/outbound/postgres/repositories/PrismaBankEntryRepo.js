"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaBankEntryRepo = void 0;
class PrismaBankEntryRepo {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByShipAndYear(shipId, year) {
        return this.prisma.bankEntry.findMany({
            where: { shipId, year },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(shipId, year, amountGco2eq) {
        return this.prisma.bankEntry.create({
            data: { shipId, year, amountGco2eq },
        });
    }
    async sumByShipAndYear(shipId, year) {
        const aggregate = await this.prisma.bankEntry.aggregate({
            where: { shipId, year },
            _sum: { amountGco2eq: true },
        });
        return aggregate._sum.amountGco2eq || 0;
    }
}
exports.PrismaBankEntryRepo = PrismaBankEntryRepo;
//# sourceMappingURL=PrismaBankEntryRepo.js.map