import { PrismaClient } from '@prisma/client';
import { IPoolRepository } from '../../../../core/application/ports/outbound';
export declare class PrismaPoolRepo implements IPoolRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    create(year: number, members: Array<{
        shipId: string;
        cbBefore: number;
        cbAfter: number;
    }>): Promise<any>;
}
//# sourceMappingURL=PrismaPoolRepo.d.ts.map