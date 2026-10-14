import { Router, Request, Response } from 'express';
import { crowdStore } from '../services/crowdStore';
import { createRateLimiter } from '../middleware/rateLimiter';
import { getMessage } from '../i18n/translations';
import { sanitizeText } from '../utils/sanitizer';

const router = Router();

// Rate limit: Max 5 submissions per minute per IP
const reportLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 5
});

router.post('/report', reportLimiter, (req: Request, res: Response) => {
  const lang = (req.headers['accept-language'] as string) || (req.query.lang as string) || 'en';
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
                   req.socket.remoteAddress ||
                   'unknown-client';

  const { trainId, coach, crowdLevel, cleanlinessLevel, comment } = req.body || {};

  const result = crowdStore.validateAndAdd({
    trainId: sanitizeText(trainId),
    coach: sanitizeText(coach),
    crowdLevel: sanitizeText(crowdLevel),
    cleanlinessLevel: sanitizeText(cleanlinessLevel),
    comment: sanitizeText(comment, 500),
    reporterIp: clientIp
  });

  if (!result.success) {
    const errorKey = result.errorKey || 'invalidPayload';
    const statusCode = errorKey === 'duplicateReport' ? 409 : (errorKey === 'sizeLimitExceeded' ? 413 : 400);
    return res.status(statusCode).json({
      success: false,
      errorKey,
      error: getMessage(errorKey, lang)
    });
  }

  res.status(201).json({
    success: true,
    message: lang.startsWith('hi') ? 'भीड़ रिपोर्ट सफलतापूर्वक दर्ज की गई।' : 'Crowd report recorded successfully.',
    report: result.report
  });
});

// GET /api/crowd/reports - List recent reports with optional train filter
router.get('/reports', (req: Request, res: Response) => {
  const trainId = sanitizeText(req.query.trainId as string || '');
  const reports = trainId ? crowdStore.getByTrain(trainId) : crowdStore.getAll();

  res.setHeader('Cache-Control', 'no-cache');
  res.json({
    success: true,
    count: reports.length,
    reports
  });
});

// GET /api/crowd/metrics - Aggregated coach crowd heatmap & recommendations
router.get('/metrics', (req: Request, res: Response) => {
  const trainId = sanitizeText(req.query.trainId as string || '');
  const metrics = crowdStore.getMetrics(trainId || undefined);

  res.setHeader('Cache-Control', 'public, max-age=30');
  res.json({
    success: true,
    data: metrics,
    timestamp: new Date().toISOString()
  });
});

// POST /api/crowd/:id/upvote - Fellow commuter helpfulness verification
router.post('/:id/upvote', (req: Request, res: Response) => {
  const id = sanitizeText(req.params.id || '');
  const updated = crowdStore.upvote(id);

  if (!updated) {
    return res.status(404).json({
      success: false,
      error: 'Report not found'
    });
  }

  res.json({
    success: true,
    message: 'Report verified and upvoted successfully'
  });
});

export default router;
