"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stationService_1 = require("../services/stationService");
const sanitizer_1 = require("../utils/sanitizer");
const router = (0, express_1.Router)();
// GET /api/station/list - List popular demo stations
router.get('/list', (_req, res) => {
    const stationList = Object.values(stationService_1.STATION_DIRECTORY).map(s => ({
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
router.get('/:code/insights', (req, res) => {
    const code = (0, sanitizer_1.sanitizeText)(req.params.code || '');
    if (!code) {
        return res.status(400).json({
            success: false,
            error: 'Station code is required'
        });
    }
    const insights = (0, stationService_1.getStationInsights)(code);
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.json({
        success: true,
        data: insights,
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
