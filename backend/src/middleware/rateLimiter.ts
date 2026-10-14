import { Request, Response, NextFunction } from 'express';
import { getMessage } from '../i18n/translations';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export function createRateLimiter(options: { windowMs: number; maxRequests: number }) {
  const ipMap = new Map<string, RateLimitRecord>();

  // Cleanup expired items periodically
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipMap.entries()) {
      if (now > record.resetTime) {
        ipMap.delete(ip);
      }
    }
  }, 60000).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
                     req.socket.remoteAddress ||
                     'unknown-client';
    const lang = (req.headers['accept-language'] as string) || (req.query.lang as string) || 'en';
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
      const message = getMessage('rateLimitExceeded', lang);
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
