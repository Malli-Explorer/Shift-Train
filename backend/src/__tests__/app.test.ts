import request from 'supertest';
import app from '../app';

describe('App & Infrastructure Tests', () => {
  test('Health check endpoint returns status ok with demo mode', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.mode).toBe('demo');
    expect(res.body.service).toBe('shifttrain-ai-backend');
  });

  test('Non-existent route returns 404 with structured error', async () => {
    const res = await request(app).get('/api/non-existent-route-12345');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Endpoint not found');
  });
});
