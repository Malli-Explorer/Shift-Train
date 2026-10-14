"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ruleEngine_1 = require("../services/ruleEngine");
const translations_1 = require("../i18n/translations");
const router = (0, express_1.Router)();
router.post('/check', (req, res) => {
    const lang = req.headers['accept-language'] || req.query.lang || 'en';
    const { pnr, ticketStatus, coach, berthType } = req.body || {};
    if (!ticketStatus) {
        return res.status(400).json({
            success: false,
            error: (0, translations_1.getMessage)('invalidPayload', lang),
            hint: 'Please provide ticketStatus (e.g. CNF, RAC, WL, TATKAL, GENERAL)'
        });
    }
    const evaluation = (0, ruleEngine_1.evaluateTicketRules)({
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
exports.default = router;
