import { computeComparison } from '../../src/core/application/use-cases/computeComparison';

describe('computeComparison', () => {
    it('should return null diff and compliant if intensity is baseline', () => {
        const result = computeComparison({ ghgIntensity: 88, baselineIntensity: 88 });
        expect(result.percentDiff).toBeNull();
        expect(result.compliant).toBe(true);
    });

    it('should return correct percentDiff and negative compliance if over limit', () => {
        const result = computeComparison({ ghgIntensity: 100, baselineIntensity: 90 });
        expect(result.percentDiff).toBeCloseTo(11.11, 2);
        expect(result.compliant).toBe(false); // 100 > 89.3368
    });

    it('should be compliant if exactly target', () => {
        const result = computeComparison({ ghgIntensity: 89.3368, baselineIntensity: 91 });
        expect(result.compliant).toBe(true);
    });
});
