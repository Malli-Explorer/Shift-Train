import React, { useState, useEffect, useCallback } from 'react';
import { AppTranslations } from '../i18n/translations';

interface CrowdReportItem {
  id: string;
  trainId: string;
  coach: string;
  crowdLevel: string;
  cleanlinessLevel?: string;
  comment: string;
  timestamp: number;
  upvotes?: number;
}

interface CrowdReportProps {
  t: AppTranslations;
  apiBaseUrl: string;
  lang: string;
}

export const CrowdReport: React.FC<CrowdReportProps> = ({ t, apiBaseUrl, lang }) => {
  const [trainId, setTrainId] = useState('99011');
  const [coach, setCoach] = useState('B1');
  const [crowdLevel, setCrowdLevel] = useState('HIGH');
  const [cleanlinessLevel, setCleanlinessLevel] = useState('AVERAGE');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState<CrowdReportItem[]>([]);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/crowd/reports`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.warn('Failed to fetch crowd reports:', e);
    }
  }, [apiBaseUrl]);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/crowd/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': lang
        },
        body: JSON.stringify({
          trainId,
          coach,
          crowdLevel,
          cleanlinessLevel,
          comment
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({
          type: 'error',
          message: data.error || t.networkError
        });
      } else {
        setFeedback({
          type: 'success',
          message: data.message || t.reportSuccess
        });
        setComment('');
        fetchReports();
      }
    } catch {
      setFeedback({
        type: 'error',
        message: t.networkError
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (reportId: string) => {
    if (upvotedIds.has(reportId)) return;

    try {
      const res = await fetch(`${apiBaseUrl}/api/crowd/${encodeURIComponent(reportId)}/upvote`, {
        method: 'POST'
      });
      if (res.ok) {
        setUpvotedIds(prev => new Set(prev).add(reportId));
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r));
      }
    } catch (e) {
      console.warn('Upvote error:', e);
    }
  };

  const getCrowdBadgeClass = (level: string) => {
    switch (level) {
      case 'LOW': return 'badge-green';
      case 'MEDIUM': return 'badge-yellow';
      case 'HIGH': return 'badge-orange';
      case 'EXTREME': return 'badge-red';
      default: return 'badge-gray';
    }
  };

  // Metrics summary
  const total = reports.length;
  const countLow = reports.filter(r => r.crowdLevel === 'LOW').length;
  const countMed = reports.filter(r => r.crowdLevel === 'MEDIUM').length;
  const countHigh = reports.filter(r => r.crowdLevel === 'HIGH').length;
  const countExt = reports.filter(r => r.crowdLevel === 'EXTREME').length;

  return (
    <section className="tab-panel" aria-labelledby="crowd-heading" role="tabpanel">
      <div className="panel-header">
        <h2 id="crowd-heading">👥 {t.crowdTitle}</h2>
        <p className="panel-subtitle">{t.crowdSubtitle}</p>
      </div>

      {/* Heatmap / Metrics Summary Bar */}
      {total > 0 && (
        <div className="app-card crowd-heatmap-bar" aria-label={t.crowdHeatmapTitle}>
          <h3>📊 {t.crowdHeatmapTitle} ({total} verified reports)</h3>
          <div className="density-strip" role="img" aria-label={`Distribution: Low ${countLow}, Medium ${countMed}, High ${countHigh}, Extreme ${countExt}`}>
            {countLow > 0 && <div className="strip-seg seg-low" style={{ flex: countLow }} title={`Low: ${countLow}`} />}
            {countMed > 0 && <div className="strip-seg seg-med" style={{ flex: countMed }} title={`Medium: ${countMed}`} />}
            {countHigh > 0 && <div className="strip-seg seg-high" style={{ flex: countHigh }} title={`High: ${countHigh}`} />}
            {countExt > 0 && <div className="strip-seg seg-ext" style={{ flex: countExt }} title={`Extreme: ${countExt}`} />}
          </div>
          <div className="density-legend">
            <span>🟢 {t.crowdLow}: {countLow}</span>
            <span>🟡 {t.crowdMedium}: {countMed}</span>
            <span>🟠 {t.crowdHigh}: {countHigh}</span>
            <span>🔴 {t.crowdExtreme}: {countExt}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="app-card form-grid" aria-label="Submit Carriage Crowd Report">
        <div className="form-group">
          <label htmlFor="train-id-input">{t.trainNumber}</label>
          <input
            id="train-id-input"
            type="text"
            value={trainId}
            onChange={(e) => setTrainId(e.target.value)}
            required
            className="form-input"
            placeholder="e.g. 99011 or Shift Express"
          />
        </div>

        <div className="form-group">
          <label htmlFor="coach-input">{t.coachNumber}</label>
          <input
            id="coach-input"
            type="text"
            value={coach}
            onChange={(e) => setCoach(e.target.value)}
            required
            className="form-input"
            placeholder="e.g. S3, B1"
            maxLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="crowd-level-select">{t.crowdLevel}</label>
          <select
            id="crowd-level-select"
            value={crowdLevel}
            onChange={(e) => setCrowdLevel(e.target.value)}
            className="form-select"
          >
            <option value="LOW">{t.crowdLow}</option>
            <option value="MEDIUM">{t.crowdMedium}</option>
            <option value="HIGH">{t.crowdHigh}</option>
            <option value="EXTREME">{t.crowdExtreme}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="cleanliness-select">{t.cleanliness}</label>
          <select
            id="cleanliness-select"
            value={cleanlinessLevel}
            onChange={(e) => setCleanlinessLevel(e.target.value)}
            className="form-select"
          >
            <option value="CLEAN">{t.cleanClean}</option>
            <option value="AVERAGE">{t.cleanAverage}</option>
            <option value="POOR">{t.cleanPoor}</option>
          </select>
        </div>

        <div className="form-group full-width">
          <div className="label-row">
            <label htmlFor="crowd-comment">{t.commentLabel}</label>
            <span className="char-counter" aria-live="polite">{comment.length} / 500</span>
          </div>
          <textarea
            id="crowd-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={2}
            className="form-textarea"
            placeholder={t.commentPlaceholder}
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" disabled={loading} className="primary-btn" aria-busy={loading}>
            {loading ? `⏳ ${t.submitting}` : `📤 ${t.submitReport}`}
          </button>
        </div>
      </form>

      {feedback && (
        <div className={`alert-box ${feedback.type}`} role="alert" aria-live="assertive">
          {feedback.type === 'success' ? '✅' : '⚠️'} {feedback.message}
        </div>
      )}

      <div className="reports-section" aria-live="polite">
        <h3>📋 {t.recentReports}</h3>
        {reports.length === 0 ? (
          <p className="no-data-notice">{t.noReportsYet}</p>
        ) : (
          <div className="reports-grid">
            {reports.map((r) => (
              <div key={r.id} className="app-card report-card">
                <div className="report-card-top">
                  <div>
                    <span className="report-train">Train #{r.trainId}</span>
                    <span className="report-coach-badge">Coach {r.coach}</span>
                  </div>
                  <span className={`crowd-pill ${getCrowdBadgeClass(r.crowdLevel)}`}>
                    {r.crowdLevel}
                  </span>
                </div>
                {r.comment && <p className="report-comment">"{r.comment}"</p>}
                <div className="report-card-footer">
                  <span className="report-meta">
                    ✨ {r.cleanlinessLevel || 'AVERAGE'} • {new Date(r.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    type="button"
                    className={`upvote-btn ${upvotedIds.has(r.id) ? 'upvoted' : ''}`}
                    onClick={() => handleUpvote(r.id)}
                    aria-label={`Upvote report for Coach ${r.coach}`}
                    disabled={upvotedIds.has(r.id)}
                  >
                    👍 {r.upvotes || 0}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
