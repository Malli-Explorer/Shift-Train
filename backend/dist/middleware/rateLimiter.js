"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRateLimiter = createRateLimiter;
const translations_1 = require("../i18n/translations");
function createRateLimiter(options) {
    const ipMap = new Map();
    // Cleanup expired items periodically
    setInterval(() => {
        const now = Date.now();
        for (const [ip, record] of ipMap.entries()) {
            if (now > record.resetTime) {
                ipMap.delete(ip);
            }
        }
    }, 60000).unref();
    return (req, res, next) => {
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() ||
            req.socket.remoteAddress ||
            'unknown-client';
        const lang = req.headers['accept-language'] || req.query.lang || 'en';
        const now = Date.now();
        const record = ipMap.get(clientIp);
        if (!record || now > record.resetTime) {
            ipMap.set(clientIp, {
                count: 1,
                resetTime: now + options.windowMs
            });
            return next();
        }
        if (record.count >= options.maxRequests) {
            const message = (0, translations_1.getMessage)('rateLimitExceeded', lang);
            return res.status(429).json({
                success: false,
                error: message,
                retryAfterMs: record.resetTime - now
            });
        }
        record.count += 1;
        next();
    };
}
