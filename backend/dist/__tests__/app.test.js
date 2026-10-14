"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('App & Infrastructure Tests', () => {
    test('Health check endpoint returns status ok with demo mode', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ok');
        expect(res.body.mode).toBe('demo');
        expect(res.body.service).toBe('shifttrain-ai-backend');
    });
    test('Non-existent route returns 404 with structured error', async () => {
        const res = await (0, supertest_1.default)(app_1.default).get('/api/non-existent-route-12345');
        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.error).toBe('Endpoint not found');
    });
});
