"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const trains_1 = __importDefault(require("./routes/trains"));
const crowd_1 = __importDefault(require("./routes/crowd"));
const ticket_1 = __importDefault(require("./routes/ticket"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// Parse CORS Origins
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
    : ['*'];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin ||
            allowedOrigins.includes('*') ||
            allowedOrigins.includes(origin) ||
            /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Blocked by CORS policy'));
        }
    },
    credentials: true
}));
// Body parsing with safe size limit
app.use(express_1.default.json({ limit: '50kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50kb' }));
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
app.use('/api/trains', trains_1.default);
app.use('/api/crowd', crowd_1.default);
app.use('/api/ticket', ticket_1.default);
// 404 Handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});
// Centralized error handler (guaranteed to not leak secrets)
app.use(errorHandler_1.errorHandler);
exports.default = app;
