import request from 'supertest';
import app from '../app';
import { crowdStore } from '../services/crowdStore';

describe('Express API End-to-End Tests', () => {
  beforeEach(() => {
    crowdStore.clear();
  });

  describe('GET /api/trains/search', () => {
    test('returns 3 invented demo trains labeled DEMO DATA', async () => {
      const res = await request(app).get('/api/trains/search?from=NDLS&to=BCT');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isDemoData).toBe(true);
      expect(res.body.count).toBe(3);
      expect(Array.isArray(res.body.trains)).toBe(true);
      expect(res.body.trains.length).toBe(3);
      
      res.body.trains.forEach((train: any) => {
        expect(train.isDemo).toBe(true);
        expect(train.label).toBe('DEMO DATA');
      });
    });
  });

  describe('POST /api/ticket/check', () => {
    test('evaluates ticket rules and always contains "ask railway staff"', async () => {
      const res = await request(app)
        .post('/api/ticket/check')
        .send({ ticketStatus: 'RAC', coach: 'B1' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.evaluation.isDemoRuleEngine).toBe(true);
      expect(res.body.evaluation.mandatoryAdvice.toLowerCase()).toContain('ask railway staff');
    });

    test('returns 400 when ticketStatus is missing', async () => {
      const res = await request(app)
        .post('/api/ticket/check')
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST & GET /api/crowd', () => {
    test('successfully posts a crowd report and retrieves it', async () => {
      const postRes = await request(app)
        .post('/api/crowd/report')
        .send({
          trainId: '99011',
          coach: 'S1',
          crowdLevel: 'MEDIUM',
          comment: 'Moderate boarding rush'
        });

      expect(postRes.status).toBe(201);
      expect(postRes.body.success).toBe(true);
      expect(postRes.body.report.trainId).toBe('99011');

      const getRes = await request(app)
        .get('/api/crowd/reports?trainId=99011');

      expect(getRes.status).toBe(200);
      expect(getRes.body.count).toBe(1);
      expect(getRes.body.reports[0].coach).toBe('S1');
    });

    test('returns Hindi error message when requested in header on duplicate report', async () => {
      // First post
      await request(app)
        .post('/api/crowd/report')
        .send({
          trainId: '99022',
          coach: 'C1',
          crowdLevel: 'HIGH'
        });

      // Second duplicate post with Hindi header
      const dupRes = await request(app)
        .post('/api/crowd/report')
        .set('Accept-Language', 'hi')
        .send({
          trainId: '99022',
          coach: 'C1',
          crowdLevel: 'HIGH'
        });

      expect(dupRes.status).toBe(409);
      expect(dupRes.body.success).toBe(false);
      expect(dupRes.body.error).toContain('डुप्लिकेट रिपोर्ट');
    });
  });
});
