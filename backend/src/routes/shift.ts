import { Router, Request, Response } from 'express';
import { calculateShiftRecommendation, ShiftInput } from '../services/shiftEngine';
import { sanitizeText } from '../utils/sanitizer';

const router = Router();

router.post('/recommend', (req: Request, res: Response) => {
  const body = req.body || {};
  const sanitizedInput: ShiftInput = {
    currentTrainId: sanitizeText(body.currentTrainId || ''),
    source: sanitizeText(body.source || ''),
    destination: sanitizeText(body.destination || ''),
    travelDate: sanitizeText(body.travelDate || ''),
    ticketStatus: sanitizeText(body.ticketStatus || ''),
    currentCoach: sanitizeText(body.currentCoach || ''),
    crowdLevel: body.crowdLevel,
    preferredTimeWindow: sanitizeText(body.preferredTimeWindow || ''),
    lang: sanitizeText((req.headers['accept-language'] as string) || body.lang || 'en')
  };

  const result = calculateShiftRecommendation(sanitizedInput);
  
  // Cache response for 60 seconds
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json({
    success: true,
    data: result,
    timestamp: new Date().toISOString()
  });
});

router.get('/alternatives', (req: Request, res: Response) => {
  const trainId = sanitizeText(req.query.trainId as string || '');
  const source = sanitizeText(req.query.from as string || '');
  const destination = sanitizeText(req.query.to as string || '');

  const result = calculateShiftRecommendation({
    currentTrainId: trainId,
    source,
    destination
  });

  res.setHeader('Cache-Control', 'public, max-age=120');
  res.json({
    success: true,
    data: result.alternatives,
    primaryAdvice: result.primaryShiftAdvice,
    timestamp: new Date().toISOString()
  });
});

export default router;
