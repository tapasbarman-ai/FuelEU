import { Router } from 'express';
import { container } from '../../../../infrastructure/container';
import { validateSchema } from '../middleware/validateSchema';
import { createPoolSchema } from '../dto/schemas';

const router = Router();

router.post('/', validateSchema(createPoolSchema), async (req, res, next) => {
    try {
        const { year, members } = req.body;
        const result = await container.poolService.createPool(year, members);
        res.json(result);
    } catch (error) {
        next(error);
    }
});

export { router as poolRouter };
