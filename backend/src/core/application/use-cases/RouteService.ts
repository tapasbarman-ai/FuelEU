import {
    IRouteService,
    ComparisonResult,
} from '../ports/inbound';
import { IRouteRepository } from '../ports/outbound';
import { BusinessRuleError, NotFoundError } from '../../domain/errors/DomainError';
import { percentDiff, isCompliant } from '../../../shared/constants';

export class RouteService implements IRouteService {
    constructor(private readonly routeRepo: IRouteRepository) { }

    async getAllRoutes() {
        return this.routeRepo.findAll();
    }

    async setBaseline(routeId: string): Promise<{ success: boolean; routeId: string }> {
        const route = await this.routeRepo.findByRouteId(routeId);
        if (!route) {
            throw new NotFoundError('Route', routeId);
        }

        await this.routeRepo.clearBaseline();
        await this.routeRepo.setBaseline(routeId);

        return { success: true, routeId };
    }

    async getComparison(): Promise<ComparisonResult[]> {
        const allRoutes = await this.routeRepo.findAll();
        const baseline = await this.routeRepo.findBaseline();

        if (!baseline) {
            // If no baseline, percentDiff is null for everything
            return allRoutes.map((r) => ({
                routeId: r.routeId,
                vesselType: r.vesselType,
                fuelType: r.fuelType,
                year: r.year,
                ghgIntensity: r.ghgIntensity,
                isBaseline: r.isBaseline,
                percentDiff: null,
                compliant: isCompliant(r.ghgIntensity),
            }));
        }

        return allRoutes.map((r) => ({
            routeId: r.routeId,
            vesselType: r.vesselType,
            fuelType: r.fuelType,
            year: r.year,
            ghgIntensity: r.ghgIntensity,
            isBaseline: r.isBaseline,
            percentDiff: r.id === baseline.id ? null : percentDiff(baseline.ghgIntensity, r.ghgIntensity),
            compliant: isCompliant(r.ghgIntensity),
        }));
    }
}
