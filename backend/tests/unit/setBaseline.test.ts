import { RouteService } from '../../src/core/application/use-cases/RouteService';

describe('RouteService.setBaseline', () => {
    let routeService: RouteService;
    let mockRouteRepo: any;

    beforeEach(() => {
        mockRouteRepo = {
            findByRouteId: jest.fn(),
            clearBaseline: jest.fn(),
            setBaseline: jest.fn(),
        };
        routeService = new RouteService(mockRouteRepo);
    });

    it('should clear old baseline and set new one', async () => {
        // R001 exists
        mockRouteRepo.findByRouteId.mockResolvedValue({ id: '1', routeId: 'R001' });

        await routeService.setBaseline('R001');

        expect(mockRouteRepo.clearBaseline).toHaveBeenCalledTimes(1);
        expect(mockRouteRepo.setBaseline).toHaveBeenCalledWith('R001');
    });

    it('should throw NotFoundError if route does not exist', async () => {
        mockRouteRepo.findByRouteId.mockResolvedValue(null);

        await expect(routeService.setBaseline('INVALID')).rejects.toThrow('Route with id \'INVALID\' not found');
    });
});
