import { Router } from 'express';
import { container } from '../../../../infrastructure/container';
import { validateSchema } from '../middleware/validateSchema';
import { setBaselineSchema } from '../dto/schemas';

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const routes = await container.routeService.getAllRoutes();
        res.json(routes);
    } catch (error) {
        next(error);
    }
});

router.post('/:routeId/baseline', validateSchema(setBaselineSchema), async (req, res, next) => {
    try {
        const routeId = req.params.routeId as string;
        const result = await container.routeService.setBaseline(routeId);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/comparison', async (req, res, next) => {
    try {
        const comparison = await container.routeService.getComparison();
        res.json(comparison);
    } catch (error) {
        next(error);
    }
});

export { router as routeRouter };
