import { PrismaClient } from '@prisma/client';
import { IComplianceRepository } from '../../../../core/application/ports/outbound';
import { ShipCompliance } from '../../../../core/domain/entities';
export declare class PrismaComplianceRepo implements IComplianceRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null>;
    upsert(shipId: string, year: number, cbGco2eq: number): Promise<ShipCompliance>;
}
//# sourceMappingURL=PrismaComplianceRepo.d.ts.map