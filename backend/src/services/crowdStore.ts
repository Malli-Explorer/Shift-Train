import { sanitizeText, isValidCoach } from '../utils/sanitizer';

export interface CrowdReport {
  id: string;
  trainId: string;
  coach: string;
  crowdLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  cleanlinessLevel: 'POOR' | 'AVERAGE' | 'CLEAN';
  comment: string;
  timestamp: number;
  reporterIp?: string;
  upvotes: number;
}

export interface CrowdSubmissionInput {
  trainId: string;
  coach: string;
  crowdLevel: string;
  cleanlinessLevel?: string;
  comment?: string;
  reporterIp?: string;
}

export interface CrowdAggregateMetrics {
  totalReports: number;
  distribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
    EXTREME: number;
  };
  mostCrowdedCoaches: string[];
  recommendedCoaches: string[];
}

export class CrowdStore {
  private reports: CrowdReport[] = [];
  private readonly duplicateWindowMs = 3 * 60 * 1000; // 3 minutes
  private readonly maxCommentLength = 500;

  public clear(): void {
    this.reports = [];
  }

  public getAll(): CrowdReport[] {
    return [...this.reports];
  }

  public getByTrain(trainId: string): CrowdReport[] {
    const cleanTrainId = (trainId || '').trim().toUpperCase();
    return this.reports.filter(r => r.trainId.toUpperCase() === cleanTrainId);
  }

  public upvote(reportId: string): boolean {
    const report = this.reports.find(r => r.id === reportId);
    if (report) {
      report.upvotes = (report.upvotes || 0) + 1;
      return true;
    }
    return false;
  }

  public getMetrics(trainId?: string): CrowdAggregateMetrics {
    const targetReports = trainId ? this.getByTrain(trainId) : this.getAll();
    const distribution = { LOW: 0, MEDIUM: 0, HIGH: 0, EXTREME: 0 };
    const coachCrowdCount: Record<string, number> = {};

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

  public validateAndAdd(input: CrowdSubmissionInput): { 
    success: boolean; 
    errorKey?: 'duplicateReport' | 'sizeLimitExceeded' | 'invalidPayload'; 
    report?: CrowdReport 
  } {
    if (!input.trainId || !input.coach || !input.crowdLevel) {
      return { success: false, errorKey: 'invalidPayload' };
    }

    // Sanitize text inputs
    const rawComment = input.comment || '';
    if (rawComment.length > this.maxCommentLength) {
      return { success: false, errorKey: 'sizeLimitExceeded' };
    }

    const sanitizedComment = sanitizeText(rawComment, this.maxCommentLength);
    const normalizedTrainId = sanitizeText(input.trainId).toUpperCase();
    const normalizedCoach = sanitizeText(input.coach).toUpperCase();
    const normalizedCrowd = sanitizeText(input.crowdLevel).toUpperCase();

    if (!isValidCoach(normalizedCoach)) {
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

    const cleanLevel = (sanitizeText(input.cleanlinessLevel || '').toUpperCase() as CrowdReport['cleanlinessLevel']) || 'AVERAGE';
    const validCleanliness = ['POOR', 'AVERAGE', 'CLEAN'];
    const finalClean = validCleanliness.includes(cleanLevel) ? cleanLevel : 'AVERAGE';

    const newReport: CrowdReport = {
      id: `cr-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      trainId: normalizedTrainId,
      coach: normalizedCoach,
      crowdLevel: normalizedCrowd as CrowdReport['crowdLevel'],
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

export const crowdStore = new CrowdStore();
