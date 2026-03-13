import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { errorHandler } from '../../adapters/inbound/http/middleware/errorHandler';
import { routeRouter } from '../../adapters/inbound/http/routes/routeRouter';
import { complianceRouter } from '../../adapters/inbound/http/routes/complianceRouter';
import { bankingRouter } from '../../adapters/inbound/http/routes/bankingRouter';
import { poolRouter } from '../../adapters/inbound/http/routes/poolRouter';

const app = express();

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/routes', routeRouter);
app.use('/compliance', complianceRouter);
app.use('/banking', bankingRouter);
app.use('/pools', poolRouter);

// Error handler
app.use(((err, req, res, next) => {
    errorHandler(err, req, res, next);
}) as express.ErrorRequestHandler);

// Serve Static Frontend (Single-Container Deployment)
const frontendPath = path.join(__dirname, '../../../../frontend-dist');
app.use(express.static(frontendPath));

// Standard SPA Catch-All (React Router)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

export { app };
