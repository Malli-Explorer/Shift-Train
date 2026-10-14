"use strict";
/**
 * Security Input Sanitizer & Validation Utilities
 * Defends against XSS, Prototype Pollution, and Parameter Injection.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeText = sanitizeText;
exports.isValidPnr = isValidPnr;
exports.isValidCoach = isValidCoach;
exports.sanitizeObject = sanitizeObject;
function sanitizeText(input, maxLength = 500) {
    if (typeof input !== 'string') {
        return '';
    }
    // Defend against prototype pollution string keys
    if (input === '__proto__' || input === 'constructor' || input === 'prototype') {
        return '';
    }
    // Strip script tags, HTML tags, and null bytes
    let sanitized = input
        .replace(/\0/g, '')
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/javascript:/gi, '')
        .replace(/onload\s*=/gi, '')
        .replace(/onerror\s*=/gi, '')
        .trim();
    if (sanitized.length > maxLength) {
        sanitized = sanitized.slice(0, maxLength);
    }
    return sanitized;
}
function isValidPnr(pnr) {
    if (!pnr)
        return true; // Optional field
    return /^\d{10}$/.test(pnr.trim());
}
function isValidCoach(coach) {
    if (!coach)
        return false;
    return /^[A-Z0-9-]{1,6}$/i.test(coach.trim());
}
function sanitizeObject(obj) {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue;
        }
        if (typeof value === 'string') {
            result[key] = sanitizeText(value);
        }
        else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            result[key] = sanitizeObject(value);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
