import { Router } from 'express';
import { container } from '../../../../infrastructure/container';
import { validateSchema } from '../middleware/validateSchema';
import { getBankingRecordsSchema, bankSurplusSchema, applyBankedSchema } from '../dto/schemas';

const router = Router();

router.get('/records', validateSchema(getBankingRecordsSchema), async (req, res, next) => {
    try {
        const { shipId, year } = req.query as { shipId: string; year: unknown };
        const records = await container.bankingService.getRecords(shipId, Number(year));
        res.json(records);
    } catch (error) {
        next(error);
    }
});

router.post('/bank', validateSchema(bankSurplusSchema), async (req, res, next) => {
    try {
        const { shipId, year } = req.body;
        const result = await container.bankingService.bankSurplus(shipId, year);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

router.post('/apply', validateSchema(applyBankedSchema), async (req, res, next) => {
    try {
        const { shipId, year, amount } = req.body;
        const result = await container.bankingService.applyBanked(shipId, year, amount);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export { router as bankingRouter };
