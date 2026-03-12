"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bankingRouter = void 0;
const express_1 = require("express");
const container_1 = require("../../../../infrastructure/container");
const validateSchema_1 = require("../middleware/validateSchema");
const schemas_1 = require("../dto/schemas");
const router = (0, express_1.Router)();
exports.bankingRouter = router;
router.get('/records', (0, validateSchema_1.validateSchema)(schemas_1.getBankingRecordsSchema), async (req, res, next) => {
    try {
        const { shipId, year } = req.query;
        const records = await container_1.container.bankingService.getRecords(shipId, Number(year));
        res.json(records);
    }
    catch (error) {
        next(error);
    }
});
router.post('/bank', (0, validateSchema_1.validateSchema)(schemas_1.bankSurplusSchema), async (req, res, next) => {
    try {
        const { shipId, year } = req.body;
        const result = await container_1.container.bankingService.bankSurplus(shipId, year);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
router.post('/apply', (0, validateSchema_1.validateSchema)(schemas_1.applyBankedSchema), async (req, res, next) => {
    try {
        const { shipId, year, amount } = req.body;
        const result = await container_1.container.bankingService.applyBanked(shipId, year, amount);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=bankingRouter.js.map