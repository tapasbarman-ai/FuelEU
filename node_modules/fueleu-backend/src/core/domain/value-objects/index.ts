import { TARGET_INTENSITY } from '../../../shared/constants';

export class GhgIntensity {
    private readonly value: number;

    constructor(value: number) {
        if (value < 0) {
            throw new Error('GHG intensity cannot be negative');
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    isCompliant(): boolean {
        return this.value <= TARGET_INTENSITY;
    }
}

export class ComplianceBalance {
    private readonly value: number;

    constructor(value: number) {
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    isSurplus(): boolean {
        return this.value > 0;
    }

    isDeficit(): boolean {
        return this.value < 0;
    }
}

export class Year {
    private readonly value: number;

    constructor(value: number) {
        if (!Number.isInteger(value) || value < 2024 || value > 2050) {
            throw new Error(`Invalid year: ${value}. Must be between 2024 and 2050.`);
        }
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }
}

export class PercentDiff {
    private readonly value: number;

    constructor(value: number) {
        this.value = value;
    }

    getValue(): number {
        return this.value;
    }

    isImprovement(): boolean {
        return this.value < 0;
    }
}
