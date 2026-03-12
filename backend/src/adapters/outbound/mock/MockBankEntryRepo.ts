import { IBankEntryRepository } from '../../../core/application/ports/outbound';
import { BankEntry } from '../../../core/domain/entities';

export class MockBankEntryRepo implements IBankEntryRepository {
    private entries: BankEntry[] = [];

    async findByShipAndYear(shipId: string, year: number): Promise<BankEntry[]> {
        return this.entries.filter(e => e.shipId === shipId && e.year === year);
    }

    async create(shipId: string, year: number, amountGco2eq: number): Promise<BankEntry> {
        const entry = {
            id: Math.random().toString(),
            shipId,
            year,
            amountGco2eq,
            createdAt: new Date()
        };
        this.entries.push(entry);
        return entry;
    }

    async sumByShipAndYear(shipId: string, year: number): Promise<number> {
        const entries = await this.findByShipAndYear(shipId, year);
        return entries.reduce((sum, e) => sum + e.amountGco2eq, 0);
    }
}
