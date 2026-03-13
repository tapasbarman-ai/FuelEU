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
        // Step 1: Fetch current CB for all members
        const currentCbMap = await this.getCurrentCbMap(membersInput, year);
        // Step 2: Validate pool sum >= 0 (Article 21 rule: cannot create net deficit)
        let totalCb = 0;
        for (const [_, cb] of currentCbMap) {
            totalCb += cb;
        }
        if (totalCb < 0) {
            throw new DomainError_1.BusinessRuleError('INVALID_POOL', `Pool total CB is negative (${totalCb.toFixed(2)}). Sum of all members' CBs must be ≥ 0.`);
        }
        // Step 3: Greedy allocation — sort desc by CB, transfer surplus to deficits
        // Build working list of { shipId, cbBefore, cbAfter }
        const workingList = membersInput.map(m => ({
            shipId: m.shipId,
            cbBefore: currentCbMap.get(m.shipId),
            cbAfter: currentCbMap.get(m.shipId), // start = cbBefore, will be adjusted
        }));
        // Sort descending by cbBefore (surplus ships first)
        workingList.sort((a, b) => b.cbBefore - a.cbBefore);
        // Accumulate surplus available to transfer
        let surplusPool = workingList
            .filter(m => m.cbBefore > 0)
            .reduce((sum, m) => sum + m.cbBefore, 0);
        // Transfer surplus to each deficit member
        for (const member of workingList) {
            if (member.cbBefore >= 0) {
                // Surplus ships donate all their CB to the pool; they exit at 0
                member.cbAfter = 0;
                continue;
            }
            // Deficit ship: try to cover deficit from shared surplus
            const deficit = -member.cbBefore;
            const transfer = Math.min(deficit, surplusPool);
            member.cbAfter = member.cbBefore + transfer;
            surplusPool -= transfer;
        }
        // Step 4: Validate per-member rules after allocation
        for (const member of workingList) {
            // Rule: deficit ship cannot exit worse than it entered
            if (member.cbBefore < 0 && member.cbAfter < member.cbBefore) {
                throw new DomainError_1.BusinessRuleError('INVALID_POOL', `Deficit member ${member.shipId} cannot exit worse (before: ${member.cbBefore}, after: ${member.cbAfter})`);
            }
            // Rule: surplus ship cannot exit negative
            if (member.cbBefore > 0 && member.cbAfter < 0) {
                throw new DomainError_1.BusinessRuleError('INVALID_POOL', `Surplus member ${member.shipId} cannot exit negative (cbAfter: ${member.cbAfter})`);
            }
        }
        return this.poolRepo.create(year, workingList);
    }
}
exports.PoolService = PoolService;
//# sourceMappingURL=PoolService.js.map