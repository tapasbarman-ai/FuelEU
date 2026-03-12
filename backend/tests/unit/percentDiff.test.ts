import { percentDiff } from '../../src/shared/constants';

describe('percentDiff', () => {
    it('should correctly calculate lower percentage difference', () => {
        const diff = percentDiff(100, 90);
        expect(diff).toBeCloseTo(-10);
    });

    it('should correctly calculate higher percentage difference', () => {
        const diff = percentDiff(100, 110);
        expect(diff).toBeCloseTo(10);
    });

    it('should correctly calculate zero percentage difference', () => {
        const diff = percentDiff(100, 100);
        expect(diff).toBeCloseTo(0);
    });
});
