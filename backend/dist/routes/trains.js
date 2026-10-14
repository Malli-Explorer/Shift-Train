"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVENTED_TRAINS = void 0;
const express_1 = require("express");
const translations_1 = require("../i18n/translations");
const sanitizer_1 = require("../utils/sanitizer");
const router = (0, express_1.Router)();
exports.INVENTED_TRAINS = [
    {
        trainNumber: '99011',
        trainName: 'Shift Express (Simulated)',
        source: 'NDLS - New Delhi',
        destination: 'BCT - Mumbai Central',
        departureTime: '06:00',
        arrivalTime: '21:30',
        duration: '15h 30m',
        classes: ['1A', '2A', '3A', 'SL'],
        runningDays: ['Mon', 'Wed', 'Fri', 'Sun'],
        crowdLevel: 'EXTREME',
        punctualityScore: 88,
        shiftAlternativeTrainNumber: '99014',
        isDemo: true,
        label: 'DEMO DATA'
    },
    {
        trainNumber: '99014',
        trainName: 'Vande Bharat Shift Superfast (Demo)',
        source: 'NDLS - New Delhi',
        destination: 'BCT - Mumbai Central',
        departureTime: '06:45',
        arrivalTime: '19:45',
        duration: '13h 00m',
        classes: ['EC', 'CC'],
        runningDays: ['Daily except Thu'],
        crowdLevel: 'LOW',
        punctualityScore: 97,
        isDemo: true,
        label: 'DEMO DATA'
    },
    {
        trainNumber: '99018',
        trainName: 'Tejas Smart Shift Express',
        source: 'NDLS - New Delhi',
        destination: 'BCT - Mumbai Central',
        departureTime: '16:55',
        arrivalTime: '08:35',
        duration: '15h 40m',
        classes: ['1A', '2A', '3A'],
        runningDays: ['Daily'],
        crowdLevel: 'MEDIUM',
        punctualityScore: 93,
        isDemo: true,
        label: 'DEMO DATA'
    },
    {
        trainNumber: '99022',
        trainName: 'Jan Shatabdi Demo',
        source: 'HWH - Howrah',
        destination: 'PNBE - Patna Jn',
        departureTime: '14:15',
        arrivalTime: '21:45',
        duration: '7h 30m',
        classes: ['CC', '2S'],
        runningDays: ['Daily'],
        crowdLevel: 'HIGH',
        punctualityScore: 84,
        shiftAlternativeTrainNumber: '99024',
        isDemo: true,
        label: 'DEMO DATA'
    },
    {
        trainNumber: '99024',
        trainName: 'Patna Vande Express Shift (Demo)',
        source: 'HWH - Howrah',
        destination: 'PNBE - Patna Jn',
        departureTime: '15:20',
        arrivalTime: '21:55',
        duration: '6h 35m',
        classes: ['CC', 'EC'],
        runningDays: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat', 'Sun'],
        crowdLevel: 'LOW',
        punctualityScore: 96,
        isDemo: true,
        label: 'DEMO DATA'
    },
    {
        trainNumber: '99033',
        trainName: 'Duronto Superfast Demo',
        source: 'SBC - Bengaluru City',
        destination: 'MAS - Chennai Central',
        departureTime: '07:30',
        arrivalTime: '13:00',
        duration: '5h 30m',
        classes: ['1A', '2A', '3A'],
        runningDays: ['Tue', 'Thu', 'Sat'],
        crowdLevel: 'HIGH',
        punctualityScore: 91,
        shiftAlternativeTrainNumber: '99036',
        isDemo: true,
        label: 'DEMO DATA'
    },
    {
        trainNumber: '99036',
        trainName: 'Shatabdi Shift Express (Demo)',
        source: 'SBC - Bengaluru City',
        destination: 'MAS - Chennai Central',
        departureTime: '06:00',
        arrivalTime: '11:00',
        duration: '5h 00m',
        classes: ['CC', 'EC', '2S'],
        runningDays: ['Daily'],
        crowdLevel: 'LOW',
        punctualityScore: 98,
        isDemo: true,
        label: 'DEMO DATA'
    }
];
router.get('/search', (req, res) => {
    const lang = (0, sanitizer_1.sanitizeText)(req.headers['accept-language'] || req.query.lang || 'en');
    const fromQuery = (0, sanitizer_1.sanitizeText)(req.query.from || '').toLowerCase();
    const toQuery = (0, sanitizer_1.sanitizeText)(req.query.to || '').toLowerCase();
    const date = (0, sanitizer_1.sanitizeText)(req.query.date || '');
    const classFilter = (0, sanitizer_1.sanitizeText)(req.query.class || '').toUpperCase();
    let matchingTrains = exports.INVENTED_TRAINS;
    if (fromQuery || toQuery) {
        matchingTrains = matchingTrains.filter(t => {
            const matchFrom = !fromQuery || t.source.toLowerCase().includes(fromQuery);
            const matchTo = !toQuery || t.destination.toLowerCase().includes(toQuery);
            return matchFrom && matchTo;
        });
    }
    if (classFilter) {
        matchingTrains = matchingTrains.filter(t => t.classes.includes(classFilter));
    }
    // Fallback to all demo trains if route query yielded no matches (to keep demo functional)
    const results = matchingTrains.length > 0 ? matchingTrains : exports.INVENTED_TRAINS;
    // Cache response for 120 seconds for high efficiency
    res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
    res.json({
        success: true,
        isDemoData: true,
        disclaimer: (0, translations_1.getMessage)('demoDataNotice', lang),
        searchQuery: { from: req.query.from, to: req.query.to, date, class: classFilter },
        count: results.length,
        trains: results
    });
});
exports.default = router;
