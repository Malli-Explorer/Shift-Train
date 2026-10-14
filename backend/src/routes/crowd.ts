import { Router, Request, Response } from 'express';
import { crowdStore } from '../services/crowdStore';
import { createRateLimiter } from '../middleware/rateLimiter';
import { getMessage } from '../i18n/translations';

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
    trainId,
    coach,
    crowdLevel,
    cleanlinessLevel,
    comment,
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

router.get('/reports', (req: Request, res: Response) => {
  const trainId = req.query.trainId as string;
  const reports = trainId ? crowdStore.getByTrain(trainId) : crowdStore.getAll();

  res.json({
    success: true,
    count: reports.length,
    reports
  });
});

export default router;
