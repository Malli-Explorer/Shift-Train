"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const translations_1 = require("../i18n/translations");
function errorHandler(err, req, res, _next) {
    const lang = req.headers['accept-language'] || req.query.lang || 'en';
    const status = typeof err.status === 'number' ? err.status : 500;
    // Never expose sensitive internal errors, stack traces, or process.env keys
    const message = status === 404
        ? (0, translations_1.getMessage)('notFound', lang)
        : (err.message && err.isPublic ? err.message : (0, translations_1.getMessage)('internalServerError', lang));
    res.status(status).json({
        success: false,
        error: message,
        statusCode: status
    });
}
