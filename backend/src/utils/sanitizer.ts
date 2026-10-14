/**
 * Security Input Sanitizer & Validation Utilities
 * Defends against XSS, Prototype Pollution, and Parameter Injection.
 */

export function sanitizeText(input: unknown, maxLength = 500): string {
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

export function isValidPnr(pnr: string): boolean {
  if (!pnr) return true; // Optional field
  return /^\d{10}$/.test(pnr.trim());
}

export function isValidCoach(coach: string): boolean {
  if (!coach) return false;
  return /^[A-Z0-9-]{1,6}$/i.test(coach.trim());
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    if (typeof value === 'string') {
      result[key] = sanitizeText(value);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
