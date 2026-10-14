"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crowdStore = exports.CrowdStore = void 0;
const sanitizer_1 = require("../utils/sanitizer");
class CrowdStore {
    reports = [];
    duplicateWindowMs = 3 * 60 * 1000; // 3 minutes
    maxCommentLength = 500;
    clear() {
        this.reports = [];
    }
    getAll() {
        return [...this.reports];
    }
    getByTrain(trainId) {
        const cleanTrainId = (trainId || '').trim().toUpperCase();
        return this.reports.filter(r => r.trainId.toUpperCase() === cleanTrainId);
    }
    upvote(reportId) {
        const report = this.reports.find(r => r.id === reportId);
        if (report) {
            report.upvotes = (report.upvotes || 0) + 1;
            return true;
        }
        return false;
    }
    getMetrics(trainId) {
        const targetReports = trainId ? this.getByTrain(trainId) : this.getAll();
        const distribution = { LOW: 0, MEDIUM: 0, HIGH: 0, EXTREME: 0 };
        const coachCrowdCount = {};
        for (const r of targetReports) {
            if (distribution[r.crowdLevel] !== undefined) {
                distribution[r.crowdLevel] += 1;
            }
            const weight = r.crowdLevel === 'EXTREME' ? 4 : (r.crowdLevel === 'HIGH' ? 3 : (r.crowdLevel === 'MEDIUM' ? 2 : 1));
            coachCrowdCount[r.coach] = (coachCrowdCount[r.coach] || 0) + weight;
        }
        const sortedCoaches = Object.entries(coachCrowdCount).sort((a, b) => b[1] - a[1]);
        const mostCrowdedCoaches = sortedCoaches.slice(0, 3).map(([coach]) => coach);
        const recommendedCoaches = sortedCoaches.slice(-3).reverse().map(([coach]) => coach);
        return {
            totalReports: targetReports.length,
            distribution,
            mostCrowdedCoaches,
            recommendedCoaches
        };
    }
    validateAndAdd(input) {
        if (!input.trainId || !input.coach || !input.crowdLevel) {
            return { success: false, errorKey: 'invalidPayload' };
        }
        // Sanitize text inputs
        const rawComment = input.comment || '';
        if (rawComment.length > this.maxCommentLength) {
            return { success: false, errorKey: 'sizeLimitExceeded' };
        }
        const sanitizedComment = (0, sanitizer_1.sanitizeText)(rawComment, this.maxCommentLength);
        const normalizedTrainId = (0, sanitizer_1.sanitizeText)(input.trainId).toUpperCase();
        const normalizedCoach = (0, sanitizer_1.sanitizeText)(input.coach).toUpperCase();
        const normalizedCrowd = (0, sanitizer_1.sanitizeText)(input.crowdLevel).toUpperCase();
        if (!(0, sanitizer_1.isValidCoach)(normalizedCoach)) {
            return { success: false, errorKey: 'invalidPayload' };
        }
        const validLevels = ['LOW', 'MEDIUM', 'HIGH', 'EXTREME'];
        if (!validLevels.includes(normalizedCrowd)) {
            return { success: false, errorKey: 'invalidPayload' };
        }
        const now = Date.now();
        // Duplicate check: Same train, coach, crowd level within recent window
        const isDuplicate = this.reports.some(r => {
            const isWithinWindow = now - r.timestamp < this.duplicateWindowMs;
            const isSameTarget = r.trainId.toUpperCase() === normalizedTrainId &&
                r.coach.toUpperCase() === normalizedCoach &&
                r.crowdLevel.toUpperCase() === normalizedCrowd;
            const isSameReporter = input.reporterIp && r.reporterIp === input.reporterIp;
            return isWithinWindow && (isSameTarget || (isSameReporter && isSameTarget));
        });
        if (isDuplicate) {
            return { success: false, errorKey: 'duplicateReport' };
        }
        const cleanLevel = (0, sanitizer_1.sanitizeText)(input.cleanlinessLevel || '').toUpperCase() || 'AVERAGE';
        const validCleanliness = ['POOR', 'AVERAGE', 'CLEAN'];
        const finalClean = validCleanliness.includes(cleanLevel) ? cleanLevel : 'AVERAGE';
        const newReport = {
            id: `cr-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            trainId: normalizedTrainId,
            coach: normalizedCoach,
            crowdLevel: normalizedCrowd,
            cleanlinessLevel: finalClean,
            comment: sanitizedComment,
            timestamp: now,
            reporterIp: input.reporterIp,
            upvotes: 0
        };
        this.reports.unshift(newReport);
        // Limit memory store to last 500 reports
        if (this.reports.length > 500) {
            this.reports.pop();
        }
        return { success: true, report: newReport };
    }
}
exports.CrowdStore = CrowdStore;
exports.crowdStore = new CrowdStore();
