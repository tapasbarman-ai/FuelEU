export const TARGET_INTENSITY = 89.3368; // gCO₂e/MJ (2% below 91.16)
export const ENERGY_FACTOR = 41_000; // MJ per tonne of fuel

/**
 * Compute the Compliance Balance (CB) for a ship.
 * Positive = Surplus, Negative = Deficit
 */
export function computeCB(ghgIntensity: number, fuelConsumption: number): number {
    const energyInScope = fuelConsumption * ENERGY_FACTOR; // MJ
    return (TARGET_INTENSITY - ghgIntensity) * energyInScope; // gCO₂e
}

/**
 * Calculate percentage difference of a comparison route vs baseline.
 */
export function percentDiff(baseline: number, comparison: number): number {
    return ((comparison / baseline) - 1) * 100;
}

/**
 * Check if a route is compliant with the FuelEU target.
 */
export function isCompliant(ghgIntensity: number): boolean {
    return ghgIntensity <= TARGET_INTENSITY;
}
