import { PrismaClient } from '@prisma/client';
import { IRouteRepository } from '../../../core/application/ports/outbound';
import { Route } from '../../../core/domain/entities';

export class PrismaRouteRepo implements IRouteRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findAll(): Promise<Route[]> {
        return this.prisma.route.findMany({
            orderBy: { routeId: 'asc' },
        });
    }

    async findById(id: string): Promise<Route | null> {
        return this.prisma.route.findUnique({
            where: { id },
        });
    }

    async findByRouteId(routeId: string): Promise<Route | null> {
        return this.prisma.route.findUnique({
            where: { routeId },
        });
    }

    async findBaseline(): Promise<Route | null> {
        return this.prisma.route.findFirst({
            where: { isBaseline: true },
        });
    }

    async clearBaseline(): Promise<void> {
        await this.prisma.route.updateMany({
            where: { isBaseline: true },
            data: { isBaseline: false },
        });
    }

    async setBaseline(routeId: string): Promise<Route> {
        return this.prisma.route.update({
            where: { routeId },
            data: { isBaseline: true },
        });
    }
}
