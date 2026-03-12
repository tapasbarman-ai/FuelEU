"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaPoolRepo = void 0;
class PrismaPoolRepo {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(year, members) {
        return this.prisma.pool.create({
            data: {
                year,
                members: {
                    create: members.map((m) => ({
                        shipId: m.shipId,
                        cbBefore: m.cbBefore,
                        cbAfter: m.cbAfter,
                    })),
                },
            },
            include: {
                members: true,
            },
        });
    }
}
exports.PrismaPoolRepo = PrismaPoolRepo;
//# sourceMappingURL=PrismaPoolRepo.js.map