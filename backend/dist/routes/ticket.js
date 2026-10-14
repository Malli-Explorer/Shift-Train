"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ruleEngine_1 = require("../services/ruleEngine");
const translations_1 = require("../i18n/translations");
const sanitizer_1 = require("../utils/sanitizer");
const router = (0, express_1.Router)();
router.post('/check', (req, res) => {
    const lang = (0, sanitizer_1.sanitizeText)(req.headers['accept-language'] || req.query.lang || 'en');
    const { pnr, ticketStatus, coach, berthType } = req.body || {};
    const cleanStatus = (0, sanitizer_1.sanitizeText)(ticketStatus);
    const cleanPnr = (0, sanitizer_1.sanitizeText)(pnr);
    const cleanCoach = (0, sanitizer_1.sanitizeText)(coach);
    const cleanBerth = (0, sanitizer_1.sanitizeText)(berthType);
    if (!cleanStatus) {
        return res.status(400).json({
            success: false,
            error: (0, translations_1.getMessage)('invalidPayload', lang),
            hint: 'Please provide ticketStatus (e.g. CNF, RAC, WL, TATKAL, GENERAL)'
        });
    }
    if (cleanPnr && !(0, sanitizer_1.isValidPnr)(cleanPnr)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid PNR format. PNR must be a 10-digit numeric string.',
            hint: 'Leave empty or provide a 10-digit number.'
        });
    }
    const evaluation = (0, ruleEngine_1.evaluateTicketRules)({
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
exports.default = router;
