"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeRouter = void 0;
const express_1 = require("express");
const container_1 = require("../../../../infrastructure/container");
const validateSchema_1 = require("../middleware/validateSchema");
const schemas_1 = require("../dto/schemas");
const router = (0, express_1.Router)();
exports.routeRouter = router;
router.get('/', async (req, res, next) => {
    try {
        const routes = await container_1.container.routeService.getAllRoutes();
        res.json(routes);
    }
    catch (error) {
        next(error);
    }
});
router.post('/:routeId/baseline', (0, validateSchema_1.validateSchema)(schemas_1.setBaselineSchema), async (req, res, next) => {
    try {
        const routeId = req.params.routeId;
        const result = await container_1.container.routeService.setBaseline(routeId);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/comparison', async (req, res, next) => {
    try {
        const comparison = await container_1.container.routeService.getComparison();
        res.json(comparison);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=routeRouter.js.map