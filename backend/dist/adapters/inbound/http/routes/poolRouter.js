"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.poolRouter = void 0;
const express_1 = require("express");
const container_1 = require("../../../../infrastructure/container");
const validateSchema_1 = require("../middleware/validateSchema");
const schemas_1 = require("../dto/schemas");
const router = (0, express_1.Router)();
exports.poolRouter = router;
router.post('/', (0, validateSchema_1.validateSchema)(schemas_1.createPoolSchema), async (req, res, next) => {
    try {
        const { year, members } = req.body;
        const result = await container_1.container.poolService.createPool(year, members);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=poolRouter.js.map