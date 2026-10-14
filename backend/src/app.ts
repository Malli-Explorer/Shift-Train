import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import trainsRouter from './routes/trains';
import crowdRouter from './routes/crowd';
import ticketRouter from './routes/ticket';
import shiftRouter from './routes/shift';
import stationRouter from './routes/station';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Trust reverse proxy (Render, Cloudflare, Vercel)
app.set('trust proxy', 1);

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.vercel.app", "https://shifttrain-backend.onrender.com"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// HTTP Compression (gzip / deflate) for efficiency
app.use(compression({
  threshold: 1024, // compress responses above 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Parse CORS Origins
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['*'];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes('*') ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin) ||
      origin === 'http://localhost:3000' ||
      origin === 'http://localhost:5173'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

// Body parsing with safe size limit (20kb max to prevent DoS)
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));

// Root Welcome Route
app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'shifttrain-ai-backend',
    message: 'ShiftTrain AI API is live, secure, and operational.',
    version: '1.2.0',
    capabilities: [
      'train-search',
      'shift-recommendations',
      'crowd-reports',
      'deterministic-ticket-check',
      'station-platform-intelligence'
    ],
    endpoints: {
      health: '/api/health',
      trains: '/api/trains/search',
      shift: '/api/shift/recommend',
      shiftAlternatives: '/api/shift/alternatives',
      stationList: '/api/station/list',
      stationInsights: '/api/station/:code/insights',
      crowd: '/api/crowd/reports',
      crowdMetrics: '/api/crowd/metrics',
      ticket: '/api/ticket/check'
    }
  });
});

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'shifttrain-ai-backend',
    mode: 'demo',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/trains', trainsRouter);
app.use('/api/shift', shiftRouter);
app.use('/api/station', stationRouter);
app.use('/api/crowd', crowdRouter);
app.use('/api/ticket', ticketRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND'
  });
});

// Centralized error handler (guaranteed to not leak secrets)
app.use(errorHandler);

export default app;
