"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVENTED_TRAINS = void 0;
const express_1 = require("express");
const translations_1 = require("../i18n/translations");
const router = (0, express_1.Router)();
exports.INVENTED_TRAINS = [
    {
        trainNumber: "99011",
        trainName: "Shift Express (Simulated)",
        source: "NDLS (New Delhi)",
        destination: "BCT (Mumbai Central)",
        departureTime: "06:00",
        arrivalTime: "21:30",
        duration: "15h 30m",
        classes: ["1A", "2A", "3A", "SL"],
        runningDays: ["Mon", "Wed", "Fri", "Sun"],
        isDemo: true,
        label: "DEMO DATA"
    },
    {
        trainNumber: "99022",
        trainName: "Jan Shatabdi Demo",
        source: "HWH (Howrah)",
        destination: "PNBE (Patna Jn)",
        departureTime: "14:15",
        arrivalTime: "21:45",
        duration: "7h 30m",
        classes: ["CC", "2S"],
        runningDays: ["Daily"],
        isDemo: true,
        label: "DEMO DATA"
    },
    {
        trainNumber: "99033",
        trainName: "Duronto Superfast Demo",
        source: "SBC (Bengaluru City)",
        destination: "MAS (Chennai Central)",
        departureTime: "07:30",
        arrivalTime: "13:00",
        duration: "5h 30m",
        classes: ["1A", "2A", "3A"],
        runningDays: ["Tue", "Thu", "Sat"],
        isDemo: true,
        label: "DEMO DATA"
    }
];
router.get('/search', (req, res) => {
    const lang = req.headers['accept-language'] || req.query.lang || 'en';
    const from = req.query.from || '';
    const to = req.query.to || '';
    const date = req.query.date || '';
    res.json({
        success: true,
        isDemoData: true,
        disclaimer: (0, translations_1.getMessage)('demoDataNotice', lang),
        searchQuery: { from, to, date },
        count: exports.INVENTED_TRAINS.length,
        trains: exports.INVENTED_TRAINS
    });
});
exports.default = router;
