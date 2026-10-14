import express from 'express';
import cors from 'cors';
import trainsRouter from './routes/trains';
import crowdRouter from './routes/crowd';
import ticketRouter from './routes/ticket';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Parse CORS Origins
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
  : ['*'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));

// Body parsing with safe size limit
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'shifttrain-ai-backend',
    mode: 'demo',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/trains', trainsRouter);
app.use('/api/crowd', crowdRouter);
app.use('/api/ticket', ticketRouter);

// 404 Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Centralized error handler (guaranteed to not leak secrets)
app.use(errorHandler);

export default app;
