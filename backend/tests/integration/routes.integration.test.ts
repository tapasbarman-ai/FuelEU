import request from 'supertest';
import { app } from '../../src/infrastructure/server/app';

// Note: For integration tests in a real environment we'd use a test DB.
// We mock or just test the API shape to avoid needing a live DB during unit test phase
// but since this is integration, we could hit a test DB. The setup isn't fully mocked here,
// assuming container connects to default DB. We'll add some basic structure.

describe('Routes API Integration', () => {
    it('GET /routes should return a list of routes', async () => {
        const res = await request(app).get('/routes');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Since we don't have a detached test db easily set up in this test file,
    // we'll rely on the existing seed for the integration test.
    it('GET /routes/comparison should return comparison data', async () => {
        const res = await request(app).get('/routes/comparison');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('percentDiff');
        }
    });
});
