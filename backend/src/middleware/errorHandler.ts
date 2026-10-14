import { Request, Response, NextFunction } from 'express';
import { getMessage } from '../i18n/translations';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const lang = (req.headers['accept-language'] as string) || (req.query.lang as string) || 'en';
  const status = typeof err.status === 'number' ? err.status : 500;

  // Never expose sensitive internal errors, stack traces, or process.env keys
  const message = status === 404
    ? getMessage('notFound', lang)
    : (err.message && err.isPublic ? err.message : getMessage('internalServerError', lang));

  res.status(status).json({
    success: false,
    error: message,
    statusCode: status
  });
}
