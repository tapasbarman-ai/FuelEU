import { IComplianceRepository } from '../../../core/application/ports/outbound';
import { ShipCompliance } from '../../../core/domain/entities';

export class MockComplianceRepo implements IComplianceRepository {
    private records: ShipCompliance[] = [];

    async findByShipAndYear(shipId: string, year: number): Promise<ShipCompliance | null> {
        return this.records.find(r => r.shipId === shipId && r.year === year) || null;
    }

    async upsert(shipId: string, year: number, cbGco2eq: number): Promise<ShipCompliance> {
        let record = await this.findByShipAndYear(shipId, year);
        if (record) {
            record.cbGco2eq = cbGco2eq;
        } else {
            record = {
                id: Math.random().toString(),
                shipId,
                year,
                cbGco2eq,
                createdAt: new Date()
            };
            this.records.push(record);
        }
        return record;
    }
}
