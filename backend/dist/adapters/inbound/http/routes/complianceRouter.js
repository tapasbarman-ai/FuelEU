"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complianceRouter = void 0;
const express_1 = require("express");
const container_1 = require("../../../../infrastructure/container");
const validateSchema_1 = require("../middleware/validateSchema");
const schemas_1 = require("../dto/schemas");
const router = (0, express_1.Router)();
exports.complianceRouter = router;
router.get('/cb', (0, validateSchema_1.validateSchema)(schemas_1.getCbSchema), async (req, res, next) => {
    try {
        const { shipId, year } = req.query;
        const result = await container_1.container.complianceService.getCB(shipId, Number(year));
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.get('/adjusted-cb', (0, validateSchema_1.validateSchema)(schemas_1.getAdjustedCbSchema), async (req, res, next) => {
    try {
        const { shipId, year } = req.query;
        const result = await container_1.container.complianceService.getAdjustedCB(shipId, Number(year));
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=complianceRouter.js.map