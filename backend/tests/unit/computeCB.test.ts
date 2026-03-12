import { computeCB } from '../../src/shared/constants';

describe('computeCB', () => {
    it('should compute surplus correctly for a compliant route', () => {
        // R002: ghgIntensity: 88.0, fuelConsumption: 4800
        const cb = computeCB(88.0, 4800);
        // (89.3368 - 88.0) * (4800 * 41_000)
        // 1.3368 * 196800000 = 263082240
        expect(cb).toBeCloseTo(263082240, -1);
        expect(cb).toBeGreaterThan(0);
    });

    it('should compute deficit correctly for a non-compliant route', () => {
        // R001: ghgIntensity: 91.0, fuelConsumption: 5000
        const cb = computeCB(91.0, 5000);
        // (89.3368 - 91.0) * (5000 * 41_000) = -1.6632 * 205000000 = -340956000
        expect(cb).toBeCloseTo(-340956000, -1);
        expect(cb).toBeLessThan(0);
    });
});
