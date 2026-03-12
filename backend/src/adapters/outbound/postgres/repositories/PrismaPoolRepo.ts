import { PrismaClient } from '@prisma/client';
import { IPoolRepository } from '../../../core/application/ports/outbound';

export class PrismaPoolRepo implements IPoolRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async create(
        year: number,
        members: Array<{ shipId: string; cbBefore: number; cbAfter: number }>
    ) {
        return this.prisma.pool.create({
            data: {
                year,
                members: {
                    create: members.map((m) => ({
                        shipId: m.shipId,
                        cbBefore: m.cbBefore,
                        cbAfter: m.cbAfter,
                    })),
                },
            },
            include: {
                members: true,
            },
        });
    }
}
