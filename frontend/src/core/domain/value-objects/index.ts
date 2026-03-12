import { TARGET_INTENSITY } from '../../../shared/constants';

export class GhgIntensity {
    constructor(private readonly value: number) { }

    getValue(): number {
        return this.value;
    }

    isCompliant(): boolean {
        return this.value <= TARGET_INTENSITY;
    }
}

export class PercentDiff {
    constructor(private readonly value: number | null) { }

    getValue(): number | null {
        return this.value;
    }

    isImprovement(): boolean {
        if (this.value === null) return false;
        return this.value < 0;
    }
}
