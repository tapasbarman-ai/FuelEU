import { PrismaClient } from '@prisma/client';
import { IBankEntryRepository } from '../../../../core/application/ports/outbound';
import { BankEntry } from '../../../../core/domain/entities';
export declare class PrismaBankEntryRepo implements IBankEntryRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]>;
    create(shipId: string, year: number, amountGco2eq: number): Promise<BankEntry>;
    sumByShipAndYear(shipId: string, year: number): Promise<number>;
}
//# sourceMappingURL=PrismaBankEntryRepo.d.ts.map