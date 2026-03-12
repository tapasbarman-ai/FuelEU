export function computeComparison(metrics: { ghgIntensity: number; baselineIntensity: number | null }): {
    percentDiff: number | null;
    compliant: boolean;
} {
    const { ghgIntensity, baselineIntensity } = metrics;
    // TARGET_INTENSITY is 89.3368
    const compliant = ghgIntensity <= 89.3368;

    if (baselineIntensity === null || baselineIntensity === ghgIntensity) {
        return { percentDiff: null, compliant };
    }

    const percentDiff = ((ghgIntensity / baselineIntensity) - 1) * 100;
    return { percentDiff, compliant };
}
