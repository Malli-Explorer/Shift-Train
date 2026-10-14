import { Router, Request, Response } from 'express';
import { evaluateTicketRules } from '../services/ruleEngine';
import { getMessage } from '../i18n/translations';

const router = Router();

router.post('/check', (req: Request, res: Response) => {
  const lang = (req.headers['accept-language'] as string) || (req.query.lang as string) || 'en';
  const { pnr, ticketStatus, coach, berthType } = req.body || {};

  if (!ticketStatus) {
    return res.status(400).json({
      success: false,
      error: getMessage('invalidPayload', lang),
      hint: 'Please provide ticketStatus (e.g. CNF, RAC, WL, TATKAL, GENERAL)'
    });
  }

  const evaluation = evaluateTicketRules({
    pnr,
    ticketStatus,
    coach,
    berthType,
    lang
  });

  res.json({
    success: true,
    evaluation
  });
});

export default router;
