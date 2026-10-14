import React, { useState, useEffect } from 'react';
import { AppTranslations } from '../i18n/translations';

interface CrowdReportItem {
  id: string;
  trainId: string;
  coach: string;
  crowdLevel: string;
  cleanlinessLevel?: string;
  comment: string;
  timestamp: number;
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
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${apiBaseUrl}/api/crowd/reports`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (e) {
      console.warn('Failed to fetch reports:', e);
    }
  };

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 10000);
    return () => clearInterval(interval);
  }, [apiBaseUrl]);

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
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: t.networkError
      });
    } finally {
      setLoading(false);
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

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">👥 {t.crowdTitle}</h2>
        <p className="section-desc">{t.crowdSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="crowd-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="train-id-input" className="form-label">{t.trainNumber}</label>
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
            <label htmlFor="coach-input" className="form-label">{t.coachNumber}</label>
            <input
              id="coach-input"
              type="text"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              required
              className="form-input"
              placeholder="e.g. S3, B1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="crowd-level-select" className="form-label">{t.crowdLevel}</label>
            <select
              id="crowd-level-select"
              value={crowdLevel}
              onChange={(e) => setCrowdLevel(e.target.value)}
              className="form-input"
            >
              <option value="LOW">{t.crowdLow}</option>
              <option value="MEDIUM">{t.crowdMedium}</option>
              <option value="HIGH">{t.crowdHigh}</option>
              <option value="EXTREME">{t.crowdExtreme}</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="cleanliness-select" className="form-label">{t.cleanliness}</label>
            <select
              id="cleanliness-select"
              value={cleanlinessLevel}
              onChange={(e) => setCleanlinessLevel(e.target.value)}
              className="form-input"
            >
              <option value="CLEAN">{t.cleanClean}</option>
              <option value="AVERAGE">{t.cleanAverage}</option>
              <option value="POOR">{t.cleanPoor}</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="crowd-comment" className="form-label">{t.commentLabel}</label>
          <textarea
            id="crowd-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={2}
            className="form-input"
            placeholder={t.commentPlaceholder}
          />
          <span className="char-count">{comment.length}/500</span>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? t.submitting : t.submitReport}
        </button>
      </form>

      {feedback && (
        <div className={feedback.type === 'success' ? 'alert-success' : 'alert-error'}>
          {feedback.message}
        </div>
      )}

      <div className="reports-section">
        <h3 className="sub-title">📋 {t.recentReports}</h3>
        {reports.length === 0 ? (
          <p className="no-data">{t.noReportsYet}</p>
        ) : (
          <div className="reports-grid">
            {reports.map((r) => (
              <div key={r.id} className="report-card">
                <div className="report-card-top">
                  <span className="report-train">Train #{r.trainId} • Coach {r.coach}</span>
                  <span className={`crowd-pill ${getCrowdBadgeClass(r.crowdLevel)}`}>
                    {r.crowdLevel}
                  </span>
                </div>
                {r.comment && <p className="report-comment">"{r.comment}"</p>}
                <div className="report-time">
                  Cleanliness: {r.cleanlinessLevel || 'AVERAGE'} • {new Date(r.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
