import { Router, Request, Response } from 'express';
import { getStationInsights, STATION_DIRECTORY } from '../services/stationService';
import { sanitizeText } from '../utils/sanitizer';

const router = Router();

// GET /api/station/list - List popular demo stations
router.get('/list', (_req: Request, res: Response) => {
  const stationList = Object.values(STATION_DIRECTORY).map(s => ({
    code: s.stationCode,
    name: s.stationName,
    city: s.city,
    congestion: s.overallCongestion,
    platformCount: s.platforms.length
  }));

  res.setHeader('Cache-Control', 'public, max-age=300');
  res.json({
    success: true,
    data: stationList,
    timestamp: new Date().toISOString()
  });
});

// GET /api/station/:code/insights - Detailed station platform & facility intelligence
router.get('/:code/insights', (req: Request, res: Response) => {
  const code = sanitizeText(req.params.code || '');
  if (!code) {
    return res.status(400).json({
      success: false,
      error: 'Station code is required'
    });
  }

  const insights = getStationInsights(code);
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.json({
    success: true,
    data: insights,
    timestamp: new Date().toISOString()
  });
});

export default router;
