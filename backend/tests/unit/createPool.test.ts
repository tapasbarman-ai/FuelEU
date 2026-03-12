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

    it('should create pool successfully and allocate using greedy strategy', async () => {
        // S1 has deficit -500. S2 has surplus 1000. Total = 500.
        mockComplianceService.getCB.mockImplementation((shipId: string) => {
            if (shipId === 'S1') return Promise.resolve({ cb: -500 });
            if (shipId === 'S2') return Promise.resolve({ cb: 1000 });
        });

        mockPoolRepo.create.mockResolvedValue({ id: 'P1' });

        await poolService.createPool(2024, [
            { shipId: 'S1' },
            { shipId: 'S2' }
        ]);

        expect(mockPoolRepo.create).toHaveBeenCalledWith(2024, expect.arrayContaining([
            // Surplus ship donates what it can, exits with 0 
            expect.objectContaining({ shipId: 'S2', cbBefore: 1000, cbAfter: 0 }),
            // Deficit ship receives 500 from surplus ship
            expect.objectContaining({ shipId: 'S1', cbBefore: -500, cbAfter: 0 })
        ]));
    });

    it('should fail if sum of current CBs is negative', async () => {
        mockComplianceService.getCB.mockImplementation((shipId: string) => {
            if (shipId === 'S1') return Promise.resolve({ cb: -500 });
            if (shipId === 'S2') return Promise.resolve({ cb: 200 }); // Total -300
        });

        await expect(poolService.createPool(2024, [
            { shipId: 'S1' },
            { shipId: 'S2' }
        ])).rejects.toThrow('Pool total CB is negative (-300.00).');
    });

    it('should properly distribute partial surplus to multiple deficits', async () => {
        // S1 has deficit -200, S2 has deficit -300, S3 has surplus 1000. Total = 500
        mockComplianceService.getCB.mockImplementation((shipId: string) => {
            if (shipId === 'S1') return Promise.resolve({ cb: -200 });
            if (shipId === 'S2') return Promise.resolve({ cb: -300 });
            if (shipId === 'S3') return Promise.resolve({ cb: 1000 });
        });

        mockPoolRepo.create.mockResolvedValue({ id: 'P2' });

        await poolService.createPool(2024, [
            { shipId: 'S1' },
            { shipId: 'S2' },
            { shipId: 'S3' }
        ]);

        expect(mockPoolRepo.create).toHaveBeenCalledWith(2024, expect.arrayContaining([
            expect.objectContaining({ shipId: 'S1', cbBefore: -200, cbAfter: 0 }),
            expect.objectContaining({ shipId: 'S2', cbBefore: -300, cbAfter: 0 }),
            expect.objectContaining({ shipId: 'S3', cbBefore: 1000, cbAfter: 0 })
        ]));
    });
});
