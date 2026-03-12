import { BankingService } from '../../src/core/application/use-cases/BankingService';

describe('BankingService.applyBanked', () => {
    let bankingService: BankingService;
    let mockBankRepo: any;
    let mockComplianceService: any;

    beforeEach(() => {
        mockBankRepo = {
            create: jest.fn(),
            sumByShipAndYear: jest.fn(),
        };
        mockComplianceService = {
            getAdjustedCB: jest.fn(),
        };
        bankingService = new BankingService(mockBankRepo, mockComplianceService);
    });

    it('should throw error if attempting to over-apply banked amount', async () => {
        // Current adjusted CB is -1000 (deficit)
        mockComplianceService.getAdjustedCB.mockResolvedValue({ shipId: 'S1', year: 2025, adjustedCb: -1000 });
        // Total banked available is 500
        mockBankRepo.sumByShipAndYear.mockResolvedValue(500);

        // Try to apply 800
        await expect(bankingService.applyBanked('S1', 2025, 800)).rejects.toThrow('Amount requested exceeds available banked surplus.');
    });

    it('should apply successfully if valid amount', async () => {
        mockComplianceService.getAdjustedCB.mockResolvedValue({ shipId: 'S1', year: 2025, adjustedCb: -1000 });
        mockBankRepo.sumByShipAndYear.mockResolvedValue(1500);
        mockBankRepo.create.mockResolvedValue({ id: 'E2', amountGco2eq: -800 } as any);

        const result = await bankingService.applyBanked('S1', 2025, 800);

        expect(result.applied).toBe(800);
        expect(result.newAdjustedCb).toBe(-200); // -1000 + 800
        expect(mockBankRepo.create).toHaveBeenCalledWith('S1', 2025, -800);
    });
});
