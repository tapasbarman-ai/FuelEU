import { BankingService } from '../../src/core/application/use-cases/BankingService';
import { IBankEntryRepository } from '../../src/core/application/ports/outbound';
import { IComplianceService } from '../../src/core/application/ports/inbound';

describe('BankingService.bankSurplus', () => {
    let bankingService: BankingService;
    let mockBankRepo: jest.Mocked<IBankEntryRepository>;
    let mockComplianceService: jest.Mocked<IComplianceService>;

    beforeEach(() => {
        mockBankRepo = {
            findByShipAndYear: jest.fn(),
            create: jest.fn(),
            sumByShipAndYear: jest.fn(),
        } as any;
        mockComplianceService = {
            getCB: jest.fn(),
            getAdjustedCB: jest.fn(),
        } as any;
        bankingService = new BankingService(mockBankRepo, mockComplianceService);
    });

    it('should bank surplus successfully if CB is positive', async () => {
        mockComplianceService.getCB.mockResolvedValue({ shipId: 'S1', year: 2024, cb: 1000, surplus: true });
        mockBankRepo.create.mockResolvedValue({ id: 'E1', shipId: 'S1', year: 2024, amountGco2eq: 1000, createdAt: new Date() });

        const result = await bankingService.bankSurplus('S1', 2024);

        expect(result.amountBanked).toBe(1000);
        expect(mockBankRepo.create).toHaveBeenCalledWith('S1', 2024, 1000);
    });

    it('should throw error if attempting to bank negative or zero CB', async () => {
        mockComplianceService.getCB.mockResolvedValue({ shipId: 'S1', year: 2024, cb: -500, surplus: false });

        await expect(bankingService.bankSurplus('S1', 2024)).rejects.toThrow('Cannot bank surplus: CB is not positive.');
    });
});
