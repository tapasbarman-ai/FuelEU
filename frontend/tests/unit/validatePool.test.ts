import { validatePool } from '../../src/core/application/use-cases/validatePool';

describe('validatePool', () => {
    it('should return empty array if pool is valid', () => {
        const errors = validatePool([
            { shipId: 'S1', currentCb: -500, allocationCb: 0 },
            { shipId: 'S2', currentCb: 1000, allocationCb: 500 }
        ]);
        expect(errors).toHaveLength(0);
    });

    it('should push error if conservation rule violated', () => {
        const errors = validatePool([
            { shipId: 'S1', currentCb: -500, allocationCb: 0 },
            { shipId: 'S2', currentCb: 1000, allocationCb: 600 } // Total alloc 600 != Total CB 500
        ]);
        expect(errors).toContain('Conservation rule violated. Expected total allocation to equal 500, got 600.');
    });
});
