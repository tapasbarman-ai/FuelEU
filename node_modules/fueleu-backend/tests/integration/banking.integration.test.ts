import request from 'supertest';
import { app } from '../../src/infrastructure/server/app';

describe('Banking API Integration', () => {
    it('POST /banking/bank should bank surplus if available', async () => {
        // R002 has surplus in seed (88.0 intensity < 89.3368)
        const res = await request(app)
            .post('/banking/bank')
            .send({ shipId: 'R002', year: 2024 });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('amountBanked');
    });

    it('POST /banking/apply should fail if applying more than banked', async () => {
        const res = await request(app)
            .post('/banking/apply')
            .send({ shipId: 'R002', year: 2025, amount: 999999999 });

        // Assuming R002 has no deficit in 2025 or amount is too high
        expect(res.statusCode).toBe(422);
        expect(res.body.code).toBe('NO_DEFICIT'); // Or INSUFFICIENT_BANK
    });
});
