import { Router } from 'express';
import { container } from '../../../../infrastructure/container';
import { validateSchema } from '../middleware/validateSchema';
import { getCbSchema, getAdjustedCbSchema } from '../dto/schemas';

const router = Router();

router.get('/cb', validateSchema(getCbSchema), async (req, res, next) => {
    try {
        const { shipId, year } = req.query as { shipId: string; year: unknown };
        const result = await container.complianceService.getCB(shipId, Number(year));
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.get('/adjusted-cb', validateSchema(getAdjustedCbSchema), async (req, res, next) => {
    try {
        const { shipId, year } = req.query as { shipId: string; year: unknown };
        const result = await container.complianceService.getAdjustedCB(shipId, Number(year));
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export { router as complianceRouter };
