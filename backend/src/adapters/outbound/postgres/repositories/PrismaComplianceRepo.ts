import { PrismaClient } from '@prisma/client';
import { IComplianceRepository } from '../../../../core/application/ports/outbound';
import { ShipCompliance } from '../../../../core/domain/entities';

export class PrismaComplianceRepo implements IComplianceRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
        return this.prisma.shipCompliance.findUnique({
            where: { shipId_year: { shipId, year } },
        });
    }

    async upsert(shipId: string, year: number, cbGco2eq: number): Promise<ShipCompliance> {
        return this.prisma.shipCompliance.upsert({
            where: { shipId_year: { shipId, year } },
            update: { cbGco2eq },
            create: { shipId, year, cbGco2eq },
        });
    }
}
