"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PercentDiff = exports.Year = exports.ComplianceBalance = exports.GhgIntensity = void 0;
const constants_1 = require("../../../shared/constants");
class GhgIntensity {
    constructor(value) {
        if (value < 0) {
            throw new Error('GHG intensity cannot be negative');
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    isCompliant() {
        return this.value <= constants_1.TARGET_INTENSITY;
    }
}
exports.GhgIntensity = GhgIntensity;
class ComplianceBalance {
    constructor(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    isSurplus() {
        return this.value > 0;
    }
    isDeficit() {
        return this.value < 0;
    }
}
exports.ComplianceBalance = ComplianceBalance;
class Year {
    constructor(value) {
        if (!Number.isInteger(value) || value < 2024 || value > 2050) {
            throw new Error(`Invalid year: ${value}. Must be between 2024 and 2050.`);
        }
        this.value = value;
    }
    getValue() {
        return this.value;
    }
}
exports.Year = Year;
class PercentDiff {
    constructor(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    isImprovement() {
        return this.value < 0;
    }
}
exports.PercentDiff = PercentDiff;
//# sourceMappingURL=index.js.map