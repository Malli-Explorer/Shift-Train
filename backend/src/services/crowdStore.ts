export interface CrowdReport {
  id: string;
  trainId: string;
  coach: string;
  crowdLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  cleanlinessLevel?: 'POOR' | 'AVERAGE' | 'CLEAN';
  comment: string;
  timestamp: number;
  reporterIp?: string;
}

export interface CrowdSubmissionInput {
  trainId: string;
  coach: string;
  crowdLevel: string;
  cleanlinessLevel?: string;
  comment?: string;
  reporterIp?: string;
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

  public validateAndAdd(input: CrowdSubmissionInput): { success: boolean; errorKey?: 'duplicateReport' | 'sizeLimitExceeded' | 'invalidPayload'; report?: CrowdReport } {
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

    const newReport: CrowdReport = {
      id: `cr-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      trainId: normalizedTrainId,
      coach: normalizedCoach,
      crowdLevel: normalizedCrowd as CrowdReport['crowdLevel'],
      cleanlinessLevel: (input.cleanlinessLevel?.toUpperCase() as CrowdReport['cleanlinessLevel']) || 'AVERAGE',
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

export const crowdStore = new CrowdStore();
