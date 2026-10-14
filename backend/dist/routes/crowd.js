"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crowdStore_1 = require("../services/crowdStore");
const rateLimiter_1 = require("../middleware/rateLimiter");
const translations_1 = require("../i18n/translations");
const sanitizer_1 = require("../utils/sanitizer");
const router = (0, express_1.Router)();
// Rate limit: Max 5 submissions per minute per IP
const reportLimiter = (0, rateLimiter_1.createRateLimiter)({
    windowMs: 60 * 1000,
    maxRequests: 5
});
router.post('/report', reportLimiter, (req, res) => {
    const lang = req.headers['accept-language'] || req.query.lang || 'en';
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.socket.remoteAddress ||
        'unknown-client';
    const { trainId, coach, crowdLevel, cleanlinessLevel, comment } = req.body || {};
    const result = crowdStore_1.crowdStore.validateAndAdd({
        trainId: (0, sanitizer_1.sanitizeText)(trainId),
        coach: (0, sanitizer_1.sanitizeText)(coach),
        crowdLevel: (0, sanitizer_1.sanitizeText)(crowdLevel),
        cleanlinessLevel: (0, sanitizer_1.sanitizeText)(cleanlinessLevel),
        comment: (0, sanitizer_1.sanitizeText)(comment, 500),
        reporterIp: clientIp
    });
    if (!result.success) {
        const errorKey = result.errorKey || 'invalidPayload';
        const statusCode = errorKey === 'duplicateReport' ? 409 : (errorKey === 'sizeLimitExceeded' ? 413 : 400);
        return res.status(statusCode).json({
            success: false,
            errorKey,
            error: (0, translations_1.getMessage)(errorKey, lang)
        });
    }
    res.status(201).json({
        success: true,
        message: lang.startsWith('hi') ? 'भीड़ रिपोर्ट सफलतापूर्वक दर्ज की गई।' : 'Crowd report recorded successfully.',
        report: result.report
    });
});
// GET /api/crowd/reports - List recent reports with optional train filter
router.get('/reports', (req, res) => {
    const trainId = (0, sanitizer_1.sanitizeText)(req.query.trainId || '');
    const reports = trainId ? crowdStore_1.crowdStore.getByTrain(trainId) : crowdStore_1.crowdStore.getAll();
    res.setHeader('Cache-Control', 'no-cache');
    res.json({
        success: true,
        count: reports.length,
        reports
    });
});
// GET /api/crowd/metrics - Aggregated coach crowd heatmap & recommendations
router.get('/metrics', (req, res) => {
    const trainId = (0, sanitizer_1.sanitizeText)(req.query.trainId || '');
    const metrics = crowdStore_1.crowdStore.getMetrics(trainId || undefined);
    res.setHeader('Cache-Control', 'public, max-age=30');
    res.json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
    });
});
// POST /api/crowd/:id/upvote - Fellow commuter helpfulness verification
router.post('/:id/upvote', (req, res) => {
    const id = (0, sanitizer_1.sanitizeText)(req.params.id || '');
    const updated = crowdStore_1.crowdStore.upvote(id);
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
exports.default = router;
