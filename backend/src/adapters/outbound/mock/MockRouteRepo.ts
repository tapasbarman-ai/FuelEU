import { IRouteRepository } from '../../../core/application/ports/outbound';
import { Route } from '../../../core/domain/entities';

export class MockRouteRepo implements IRouteRepository {
    private readonly routes: Route[] = [
        { id: '1', routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: true, createdAt: new Date() },
        { id: '2', routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88.0, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false, createdAt: new Date() },
        { id: '3', routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false, createdAt: new Date() },
        { id: '4', routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: false, createdAt: new Date() },
        { id: '5', routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false, createdAt: new Date() },
        { id: '6', routeId: 'R006', vesselType: 'RoRo', fuelType: 'LNG', year: 2024, ghgIntensity: 85.0, fuelConsumption: 8000, distance: 15000, totalEmissions: 4500, isBaseline: false, createdAt: new Date() },
    ];

    async findAll(): Promise<Route[]> {
        return this.routes;
    }

    async findById(id: string): Promise<Route | null> {
        return this.routes.find(r => r.id === id) || null;
    }

    async findByRouteId(routeId: string): Promise<Route | null> {
        return this.routes.find(r => r.routeId === routeId) || null;
    }

    async findBaseline(): Promise<Route | null> {
        return this.routes.find(r => r.isBaseline) || null;
    }

    async clearBaseline(): Promise<void> {
        this.routes.forEach(r => r.isBaseline = false);
    }

    async setBaseline(routeId: string): Promise<Route> {
        await this.clearBaseline();
        const route = await this.findByRouteId(routeId);
        if (route) {
            route.isBaseline = true;
            return route;
        }
        throw new Error('Route not found');
    }
}
