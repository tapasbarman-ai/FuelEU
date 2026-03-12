export declare const TARGET_INTENSITY = 89.3368;
export declare const ENERGY_FACTOR = 41000;
/**
 * Compute the Compliance Balance (CB) for a ship.
 * Positive = Surplus, Negative = Deficit
 */
export declare function computeCB(ghgIntensity: number, fuelConsumption: number): number;
/**
 * Calculate percentage difference of a comparison route vs baseline.
 */
export declare function percentDiff(baseline: number, comparison: number): number;
/**
 * Check if a route is compliant with the FuelEU target.
 */
export declare function isCompliant(ghgIntensity: number): boolean;
//# sourceMappingURL=constants.d.ts.map