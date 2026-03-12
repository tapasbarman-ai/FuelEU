"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteService = void 0;
const DomainError_1 = require("../../domain/errors/DomainError");
const constants_1 = require("../../../shared/constants");
class RouteService {
    constructor(routeRepo) {
        this.routeRepo = routeRepo;
    }
    async getAllRoutes() {
        return this.routeRepo.findAll();
    }
    async setBaseline(routeId) {
        const route = await this.routeRepo.findByRouteId(routeId);
        if (!route) {
            throw new DomainError_1.NotFoundError('Route', routeId);
        }
        await this.routeRepo.clearBaseline();
        await this.routeRepo.setBaseline(routeId);
        return { success: true, routeId };
    }
    async getComparison() {
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
                compliant: (0, constants_1.isCompliant)(r.ghgIntensity),
            }));
        }
        return allRoutes.map((r) => ({
            routeId: r.routeId,
            vesselType: r.vesselType,
            fuelType: r.fuelType,
            year: r.year,
            ghgIntensity: r.ghgIntensity,
            isBaseline: r.isBaseline,
            percentDiff: r.id === baseline.id ? null : (0, constants_1.percentDiff)(baseline.ghgIntensity, r.ghgIntensity),
            compliant: (0, constants_1.isCompliant)(r.ghgIntensity),
        }));
    }
}
exports.RouteService = RouteService;
//# sourceMappingURL=RouteService.js.map