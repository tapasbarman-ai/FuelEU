import {
    IBankingService,
    IComplianceService,
    BankResult,
    ApplyResult,
} from '../ports/inbound';
import { IBankEntryRepository } from '../ports/outbound';
import { BusinessRuleError } from '../../domain/errors/DomainError';

export class BankingService implements IBankingService {
    constructor(
        private readonly bankRepo: IBankEntryRepository,
        private readonly complianceService: IComplianceService
    ) { }

    async getRecords(shipId: string, year: number) {
        return this.bankRepo.findByShipAndYear(shipId, year);
    }

    async bankSurplus(shipId: string, year: number): Promise<BankResult> {
        const { cb, surplus } = await this.complianceService.getCB(shipId, year);

        if (!surplus || cb <= 0) {
            throw new BusinessRuleError('CB_NOT_POSITIVE', 'Cannot bank surplus: CB is not positive.');
        }

        const newEntry = await this.bankRepo.create(shipId, year, cb);

        return {
            bankEntryId: newEntry.id,
            shipId: newEntry.shipId,
            year: newEntry.year,
            amountBanked: newEntry.amountGco2eq,
        };
    }

    async applyBanked(shipId: string, year: number, amount: number): Promise<ApplyResult> {
        if (amount <= 0) {
            throw new BusinessRuleError('INVALID_AMOUNT', 'Amount to apply must be greater than zero.');
        }

        const { adjustedCb } = await this.complianceService.getAdjustedCB(shipId, year);
        if (adjustedCb >= 0) {
            throw new BusinessRuleError('NO_DEFICIT', 'Cannot apply banked surplus: No deficit exists.');
        }

        const totalBanked = await this.bankRepo.sumByShipAndYear(shipId, year);
        if (amount > totalBanked) {
            throw new BusinessRuleError('INSUFFICIENT_BANK', 'Amount requested exceeds available banked surplus.');
        }

        // "Applying" means creating a negative bank entry to consume the banked amount
        await this.bankRepo.create(shipId, year, -amount);

        return {
            applied: amount,
            remainingBanked: totalBanked - amount,
            newAdjustedCb: adjustedCb + amount,
        };
    }
}
