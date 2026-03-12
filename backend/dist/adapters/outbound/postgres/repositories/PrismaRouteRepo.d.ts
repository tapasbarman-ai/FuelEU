import { PrismaClient } from '@prisma/client';
import { IRouteRepository } from '../../../../core/application/ports/outbound';
import { Route } from '../../../../core/domain/entities';
export declare class PrismaRouteRepo implements IRouteRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findAll(): Promise<Route[]>;
    findById(id: string): Promise<Route | null>;
    findByRouteId(routeId: string): Promise<Route | null>;
    findBaseline(): Promise<Route | null>;
    clearBaseline(): Promise<void>;
    setBaseline(routeId: string): Promise<Route>;
}
//# sourceMappingURL=PrismaRouteRepo.d.ts.map