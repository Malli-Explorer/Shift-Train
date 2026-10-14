"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crowdStore_1 = require("../services/crowdStore");
const rateLimiter_1 = require("../middleware/rateLimiter");
const translations_1 = require("../i18n/translations");
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
            error: (0, translations_1.getMessage)(errorKey, lang)
        });
    }
    res.status(201).json({
        success: true,
        message: lang.startsWith('hi') ? 'भीड़ रिपोर्ट सफलतापूर्वक दर्ज की गई।' : 'Crowd report recorded successfully.',
        report: result.report
    });
});
router.get('/reports', (req, res) => {
    const trainId = req.query.trainId;
    const reports = trainId ? crowdStore_1.crowdStore.getByTrain(trainId) : crowdStore_1.crowdStore.getAll();
    res.json({
        success: true,
        count: reports.length,
        reports
    });
});
exports.default = router;
