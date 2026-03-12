"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENERGY_FACTOR = exports.TARGET_INTENSITY = void 0;
exports.computeCB = computeCB;
exports.percentDiff = percentDiff;
exports.isCompliant = isCompliant;
exports.TARGET_INTENSITY = 89.3368; // gCO₂e/MJ (2% below 91.16)
exports.ENERGY_FACTOR = 41000; // MJ per tonne of fuel
/**
 * Compute the Compliance Balance (CB) for a ship.
 * Positive = Surplus, Negative = Deficit
 */
function computeCB(ghgIntensity, fuelConsumption) {
    const energyInScope = fuelConsumption * exports.ENERGY_FACTOR; // MJ
    return (exports.TARGET_INTENSITY - ghgIntensity) * energyInScope; // gCO₂e
}
/**
 * Calculate percentage difference of a comparison route vs baseline.
 */
function percentDiff(baseline, comparison) {
    return ((comparison / baseline) - 1) * 100;
}
/**
 * Check if a route is compliant with the FuelEU target.
 */
function isCompliant(ghgIntensity) {
    return ghgIntensity <= exports.TARGET_INTENSITY;
}
//# sourceMappingURL=constants.js.map