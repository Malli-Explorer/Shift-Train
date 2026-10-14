"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crowdStore = exports.CrowdStore = void 0;
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
    validateAndAdd(input) {
        if (!input.trainId || !input.coach || !input.crowdLevel) {
            return { success: false, errorKey: 'invalidPayload' };
        }
        const comment = (input.comment || '').trim();
        if (comment.length > this.maxCommentLength) {
            return { success: false, errorKey: 'sizeLimitExceeded' };
        }
        const normalizedTrainId = input.trainId.trim().toUpperCase();
        const normalizedCoach = input.coach.trim().toUpperCase();
        const normalizedCrowd = input.crowdLevel.trim().toUpperCase();
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
        const newReport = {
            id: `cr-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
            trainId: normalizedTrainId,
            coach: normalizedCoach,
            crowdLevel: normalizedCrowd,
            cleanlinessLevel: input.cleanlinessLevel?.toUpperCase() || 'AVERAGE',
            comment,
            timestamp: now,
            reporterIp: input.reporterIp
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
