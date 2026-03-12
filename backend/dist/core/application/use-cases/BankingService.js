"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankingService = void 0;
const DomainError_1 = require("../../domain/errors/DomainError");
class BankingService {
    constructor(bankRepo, complianceService) {
        this.bankRepo = bankRepo;
        this.complianceService = complianceService;
    }
    async getRecords(shipId, year) {
        return this.bankRepo.findByShipAndYear(shipId, year);
    }
    async bankSurplus(shipId, year) {
        const { cb, surplus } = await this.complianceService.getCB(shipId, year);
        if (!surplus || cb <= 0) {
            throw new DomainError_1.BusinessRuleError('CB_NOT_POSITIVE', 'Cannot bank surplus: CB is not positive.');
        }
        const newEntry = await this.bankRepo.create(shipId, year, cb);
        return {
            bankEntryId: newEntry.id,
            shipId: newEntry.shipId,
            year: newEntry.year,
            amountBanked: newEntry.amountGco2eq,
        };
    }
    async applyBanked(shipId, year, amount) {
        if (amount <= 0) {
            throw new DomainError_1.BusinessRuleError('INVALID_AMOUNT', 'Amount to apply must be greater than zero.');
        }
        const { adjustedCb } = await this.complianceService.getAdjustedCB(shipId, year);
        if (adjustedCb >= 0) {
            throw new DomainError_1.BusinessRuleError('NO_DEFICIT', 'Cannot apply banked surplus: No deficit exists.');
        }
        const totalBanked = await this.bankRepo.sumByShipAndYear(shipId, year);
        if (amount > totalBanked) {
            throw new DomainError_1.BusinessRuleError('INSUFFICIENT_BANK', 'Amount requested exceeds available banked surplus.');
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
exports.BankingService = BankingService;
//# sourceMappingURL=BankingService.js.map