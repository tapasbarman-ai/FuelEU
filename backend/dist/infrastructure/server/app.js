"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const errorHandler_1 = require("../../adapters/inbound/http/middleware/errorHandler");
const routeRouter_1 = require("../../adapters/inbound/http/routes/routeRouter");
const complianceRouter_1 = require("../../adapters/inbound/http/routes/complianceRouter");
const bankingRouter_1 = require("../../adapters/inbound/http/routes/bankingRouter");
const poolRouter_1 = require("../../adapters/inbound/http/routes/poolRouter");
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
// Routes
app.use('/routes', routeRouter_1.routeRouter);
app.use('/compliance', complianceRouter_1.complianceRouter);
app.use('/banking', bankingRouter_1.bankingRouter);
app.use('/pools', poolRouter_1.poolRouter);
// Error handler
app.use(((err, req, res, next) => {
    (0, errorHandler_1.errorHandler)(err, req, res, next);
}));
//# sourceMappingURL=app.js.map