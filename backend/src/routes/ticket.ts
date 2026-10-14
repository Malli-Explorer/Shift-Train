import { Router, Request, Response } from 'express';
import { evaluateTicketRules } from '../services/ruleEngine';
import { getMessage } from '../i18n/translations';
import { sanitizeText, isValidPnr } from '../utils/sanitizer';

const router = Router();

router.post('/check', (req: Request, res: Response) => {
  const lang = sanitizeText((req.headers['accept-language'] as string) || (req.query.lang as string) || 'en');
  const { pnr, ticketStatus, coach, berthType } = req.body || {};

  const cleanStatus = sanitizeText(ticketStatus);
  const cleanPnr = sanitizeText(pnr);
  const cleanCoach = sanitizeText(coach);
  const cleanBerth = sanitizeText(berthType);

  if (!cleanStatus) {
    return res.status(400).json({
      success: false,
      error: getMessage('invalidPayload', lang),
      hint: 'Please provide ticketStatus (e.g. CNF, RAC, WL, TATKAL, GENERAL)'
    });
  }

  if (cleanPnr && !isValidPnr(cleanPnr)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid PNR format. PNR must be a 10-digit numeric string.',
      hint: 'Leave empty or provide a 10-digit number.'
    });
  }

  const evaluation = evaluateTicketRules({
    pnr: cleanPnr,
    ticketStatus: cleanStatus,
    coach: cleanCoach,
    berthType: cleanBerth,
    lang
  });

  res.json({
    success: true,
    evaluation,
    timestamp: new Date().toISOString()
  });
});

export default router;
