export function validatePool(members: Array<{ shipId: string; currentCb: number; allocationCb: number }>) {
    const errors: string[] = [];

    if (members.length === 0) {
        errors.push('Pool must have at least one member.');
        return errors;
    }

    let totalCurrentCb = 0;
    let totalAllocationCb = 0;

    for (const m of members) {
        totalCurrentCb += m.currentCb;
        totalAllocationCb += m.allocationCb;

        if (m.currentCb < 0 && m.allocationCb < m.currentCb) {
            errors.push(`Deficit member (Ship ${m.shipId}) cannot exit worse. Current: ${m.currentCb}, Allocation: ${m.allocationCb}`);
        }

        if (m.currentCb > 0 && m.allocationCb < 0) {
            errors.push(`Surplus member (Ship ${m.shipId}) cannot exit negative.`);
        }
    }

    if (totalCurrentCb < 0) {
        errors.push('Sum of current CBs is negative. Pool cannot be negative overall.');
    }

    if (Math.abs(totalAllocationCb - totalCurrentCb) > 0.0001) {
        errors.push(`Conservation rule violated. Expected total allocation to equal ${totalCurrentCb}, got ${totalAllocationCb}.`);
    }

    return errors;
}
