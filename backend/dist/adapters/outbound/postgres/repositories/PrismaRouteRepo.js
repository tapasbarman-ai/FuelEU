"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaRouteRepo = void 0;
class PrismaRouteRepo {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.route.findMany({
            orderBy: { routeId: 'asc' },
        });
    }
    async findById(id) {
        return this.prisma.route.findUnique({
            where: { id },
        });
    }
    async findByRouteId(routeId) {
        return this.prisma.route.findUnique({
            where: { routeId },
        });
    }
    async findBaseline() {
        return this.prisma.route.findFirst({
            where: { isBaseline: true },
        });
    }
    async clearBaseline() {
        await this.prisma.route.updateMany({
            where: { isBaseline: true },
            data: { isBaseline: false },
        });
    }
    async setBaseline(routeId) {
        return this.prisma.route.update({
            where: { routeId },
            data: { isBaseline: true },
        });
    }
}
exports.PrismaRouteRepo = PrismaRouteRepo;
//# sourceMappingURL=PrismaRouteRepo.js.map