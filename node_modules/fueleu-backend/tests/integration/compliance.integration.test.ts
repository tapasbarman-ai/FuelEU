import request from 'supertest';
import { app } from '../../src/infrastructure/server/app';

describe('Compliance API Integration', () => {
    it('GET /compliance/cb should return cb for existing route', async () => {
        const res = await request(app)
            .get('/compliance/cb')
            .query({ shipId: 'R001', year: 2024 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('cb');
    });

    it('GET /compliance/adjusted-cb should return adjusted cb', async () => {
        const res = await request(app)
            .get('/compliance/adjusted-cb')
            .query({ shipId: 'R001', year: 2024 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('adjustedCb');
    });
});
