import request from 'supertest';
import { app } from '../../src/infrastructure/server/app';

describe('Pools API Integration', () => {
    it('POST /pools should validate pool creation', async () => {
        const res = await request(app)
            .post('/pools')
            .send({
                year: 2024,
                members: [
                    { shipId: 'R001', allocationCb: -400000000 },
                    { shipId: 'R002', allocationCb: 200000000 },
                ]
            });

        // Will likely fail because sum of CBs might be negative for these ships overall,
        // or conservation violated. We just check that it hits the endpoint and gets a 422.
        expect(res.statusCode).toBe(422);
        expect(res.body).toHaveProperty('code');
    });
});
