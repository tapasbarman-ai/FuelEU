import { IPoolRepository } from '../../../core/application/ports/outbound';

export class MockPoolRepo implements IPoolRepository {
    private pools: any[] = [];

    async create(year: number, members: Array<{ shipId: string; cbBefore: number; cbAfter: number }>): Promise<any> {
        const poolId = Math.random().toString();
        const pool = {
            id: poolId,
            year,
            createdAt: new Date(),
            members: members.map(m => ({
                id: Math.random().toString(),
                poolId,
                shipId: m.shipId,
                cbBefore: m.cbBefore,
                cbAfter: m.cbAfter
            }))
        };
        this.pools.push(pool);
        return pool;
    }
}
