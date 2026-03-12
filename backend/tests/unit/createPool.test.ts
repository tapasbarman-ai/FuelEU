import { PoolService } from '../../src/core/application/use-cases/PoolService';

describe('PoolService.createPool', () => {
    let poolService: PoolService;
    let mockPoolRepo: any;
    let mockComplianceService: any;

    beforeEach(() => {
        mockPoolRepo = { create: jest.fn() };
        mockComplianceService = { getCB: jest.fn() };
        poolService = new PoolService(mockPoolRepo, mockComplianceService);
    });

    it('should create pool successfully when all constraints are met', async () => {
        // S1 has deficit -500. S2 has surplus 1000. Total = 500.
        mockComplianceService.getCB.mockImplementation((shipId: string) => {
            if (shipId === 'S1') return Promise.resolve({ cb: -500 });
            if (shipId === 'S2') return Promise.resolve({ cb: 1000 });
        });

        mockPoolRepo.create.mockResolvedValue({ id: 'P1' });

        await poolService.createPool(2024, [
            { shipId: 'S1', allocationCb: 0 },   // Got 500 from S2
            { shipId: 'S2', allocationCb: 500 }  // Gave 500 to S1
        ]);

        expect(mockPoolRepo.create).toHaveBeenCalledWith(2024, expect.arrayContaining([
            expect.objectContaining({ shipId: 'S1', cbBefore: -500, cbAfter: 0 }),
            expect.objectContaining({ shipId: 'S2', cbBefore: 1000, cbAfter: 500 })
        ]));
    });

    it('should fail rule 1 (conservation) if sum(allocationCb) != sum(currentCb)', async () => {
        mockComplianceService.getCB.mockResolvedValue({ cb: 500 });
        await expect(poolService.createPool(2024, [
            { shipId: 'S1', allocationCb: 400 } // Total is 500, allocation is 400. Mismatch.
        ])).rejects.toThrow('Conservation rule violated.');
    });

    it('should fail rule 2 if overall pool is negative', async () => {
        // Both ships have deficit, sum is -1500
        mockComplianceService.getCB.mockImplementation((shipId: string) => {
            if (shipId === 'S1') return Promise.resolve({ cb: -500 });
            if (shipId === 'S2') return Promise.resolve({ cb: -1000 });
        });

        await expect(poolService.createPool(2024, [
            { shipId: 'S1', allocationCb: -500 },
            { shipId: 'S2', allocationCb: -1000 }
        ])).rejects.toThrow('Sum of current CBs is negative.');
    });

    it('should fail rule 3 if a deficit member exits worse', async () => {
        mockComplianceService.getCB.mockImplementation((shipId: string) => {
            if (shipId === 'S1') return Promise.resolve({ cb: -500 }); // Deficit
            if (shipId === 'S2') return Promise.resolve({ cb: 1000 }); // Surplus
        });

        await expect(poolService.createPool(2024, [
            { shipId: 'S1', allocationCb: -600 },
            { shipId: 'S2', allocationCb: 1100 }
        ])).rejects.toThrow('Deficit member cannot exit worse.');
    });

    it('should fail rule 4 if a surplus member exits negative', async () => {
        mockComplianceService.getCB.mockImplementation((shipId: string) => {
            if (shipId === 'S1') return Promise.resolve({ cb: -1500 }); // Deficit
            if (shipId === 'S2') return Promise.resolve({ cb: 1000 });  // Surplus
            // Total sum is -500, which will fail rule 2 first anyway, let's fix that.
        });

        mockComplianceService.getCB.mockImplementation((shipId: string) => {
            if (shipId === 'S1') return Promise.resolve({ cb: -500 }); // Deficit
            if (shipId === 'S2') return Promise.resolve({ cb: 1000 }); // Surplus
        });

        await expect(poolService.createPool(2024, [
            { shipId: 'S1', allocationCb: 600 },
            { shipId: 'S2', allocationCb: -100 }
        ])).rejects.toThrow('Surplus member cannot exit negative.');
    });
});
