"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shiftEngine_1 = require("../services/shiftEngine");
const sanitizer_1 = require("../utils/sanitizer");
const router = (0, express_1.Router)();
router.post('/recommend', (req, res) => {
    const body = req.body || {};
    const sanitizedInput = {
        currentTrainId: (0, sanitizer_1.sanitizeText)(body.currentTrainId || ''),
        source: (0, sanitizer_1.sanitizeText)(body.source || ''),
        destination: (0, sanitizer_1.sanitizeText)(body.destination || ''),
        travelDate: (0, sanitizer_1.sanitizeText)(body.travelDate || ''),
        ticketStatus: (0, sanitizer_1.sanitizeText)(body.ticketStatus || ''),
        currentCoach: (0, sanitizer_1.sanitizeText)(body.currentCoach || ''),
        crowdLevel: body.crowdLevel,
        preferredTimeWindow: (0, sanitizer_1.sanitizeText)(body.preferredTimeWindow || ''),
        lang: (0, sanitizer_1.sanitizeText)(req.headers['accept-language'] || body.lang || 'en')
    };
    const result = (0, shiftEngine_1.calculateShiftRecommendation)(sanitizedInput);
    // Cache response for 60 seconds
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
    });
});
router.get('/alternatives', (req, res) => {
    const trainId = (0, sanitizer_1.sanitizeText)(req.query.trainId || '');
    const source = (0, sanitizer_1.sanitizeText)(req.query.from || '');
    const destination = (0, sanitizer_1.sanitizeText)(req.query.to || '');
    const result = (0, shiftEngine_1.calculateShiftRecommendation)({
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
exports.default = router;
