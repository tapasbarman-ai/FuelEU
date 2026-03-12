import { IPoolService, PoolMemberInput, IComplianceService } from '../ports/inbound';
import { IPoolRepository } from '../ports/outbound';
export declare class PoolService implements IPoolService {
    private readonly poolRepo;
    private readonly complianceService;
    constructor(poolRepo: IPoolRepository, complianceService: IComplianceService);
    private getCurrentCbMap;
    createPool(year: number, membersInput: PoolMemberInput[]): Promise<{
        id: string;
        year: number;
        createdAt: Date;
        members: Array<{
            id: string;
            poolId: string;
            shipId: string;
            cbBefore: number;
            cbAfter: number;
        }>;
    }>;
}
//# sourceMappingURL=PoolService.d.ts.map