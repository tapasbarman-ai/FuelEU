import { IBankingService, IComplianceService, BankResult, ApplyResult } from '../ports/inbound';
import { IBankEntryRepository } from '../ports/outbound';
export declare class BankingService implements IBankingService {
    private readonly bankRepo;
    private readonly complianceService;
    constructor(bankRepo: IBankEntryRepository, complianceService: IComplianceService);
    getRecords(shipId: string, year: number): Promise<{
        id: string;
        shipId: string;
        year: number;
        amountGco2eq: number;
        createdAt: Date;
    }[]>;
    bankSurplus(shipId: string, year: number): Promise<BankResult>;
    applyBanked(shipId: string, year: number, amount: number): Promise<ApplyResult>;
}
//# sourceMappingURL=BankingService.d.ts.map