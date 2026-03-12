"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoolService = void 0;
const DomainError_1 = require("../../domain/errors/DomainError");
class PoolService {
    constructor(poolRepo, complianceService) {
        this.poolRepo = poolRepo;
        this.complianceService = complianceService;
    }
    async getCurrentCbMap(members, year) {
        const cbMap = new Map();
        for (const member of members) {
            const { cb } = await this.complianceService.getCB(member.shipId, year);
            cbMap.set(member.shipId, cb);
        }
        return cbMap;
    }
    async createPool(year, membersInput) {
        if (membersInput.length === 0) {
            throw new DomainError_1.BusinessRuleError('INVALID_POOL', 'Pool must have at least one member');
        }
        const currentCbMap = await this.getCurrentCbMap(membersInput, year);
        let originalTotalCb = 0;
        for (const [_, cb] of currentCbMap) {
            originalTotalCb += cb;
        }
        if (originalTotalCb < 0) {
            throw new DomainError_1.BusinessRuleError('INVALID_POOL', 'Sum of current CBs is negative. Pool cannot be negative overall.');
        }
        let finalMembers = [...membersInput];
        // Check if auto-allocation is needed (if any allocationCb is undefined or all 0, we might need greedy)
        // But typing says allocationCb is number.
        const sumAllocated = finalMembers.reduce((sum, m) => sum + m.allocationCb, 0);
        // Prompt rule 1: Sum(allocationCb) === sum of members' current CBs (conservation)
        // Math.abs for float precision issues
        if (Math.abs(sumAllocated - originalTotalCb) > 0.0001) {
            // Greedy auto-allocation if we can override? The prompt says: "Greedy auto-allocation algorithm if allocationCb not supplied"
            // But the interface says `allocationCb: number`. We'll handle this in the DTO later.
            // For now, if conservation fails, throw error.
            throw new DomainError_1.BusinessRuleError('INVALID_POOL', `Conservation rule violated. Expected ${originalTotalCb}, got ${sumAllocated}`);
        }
        // Prompt rule 2: Sum(allocationCb) >= 0 (pool cannot be negative overall)
        // Since rule 1 enforces equality, this is already satisfied if originalTotalCb >= 0
        const processedMembers = [];
        for (const m of finalMembers) {
            const currentCb = currentCbMap.get(m.shipId);
            // Prompt rule 3: For each deficit member: allocationCb >= member.currentCb (cannot exit worse)
            if (currentCb < 0 && m.allocationCb < currentCb) {
                throw new DomainError_1.BusinessRuleError('INVALID_POOL', `Deficit member cannot exit worse. Ship ${m.shipId}: currentCb=${currentCb}, allocationCb=${m.allocationCb}`);
            }
            // Prompt rule 4: For each surplus member: allocationCb >= 0 (cannot exit negative)
            if (currentCb > 0 && m.allocationCb < 0) {
                throw new DomainError_1.BusinessRuleError('INVALID_POOL', `Surplus member cannot exit negative. Ship ${m.shipId}: allocationCb=${m.allocationCb}`);
            }
            processedMembers.push({
                shipId: m.shipId,
                cbBefore: currentCb,
                cbAfter: m.allocationCb
            });
        }
        return this.poolRepo.create(year, processedMembers);
    }
}
exports.PoolService = PoolService;
//# sourceMappingURL=PoolService.js.map