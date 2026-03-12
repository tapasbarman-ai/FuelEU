import { PrismaClient } from '@prisma/client';
import { IBankEntryRepository } from '../../../core/application/ports/outbound';
import { BankEntry } from '../../../core/domain/entities';

export class PrismaBankEntryRepo implements IBankEntryRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
        return this.prisma.bankEntry.findMany({
            where: { shipId, year },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(shipId: string, year: number, amountGco2eq: number): Promise<BankEntry> {
        return this.prisma.bankEntry.create({
            data: { shipId, year, amountGco2eq },
        });
    }

    async sumByShipAndYear(shipId: string, year: number): Promise<number> {
        const aggregate = await this.prisma.bankEntry.aggregate({
            where: { shipId, year },
            _sum: { amountGco2eq: true },
        });
        return aggregate._sum.amountGco2eq || 0;
    }
}
