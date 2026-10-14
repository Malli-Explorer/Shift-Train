import React, { useState } from 'react';
import { AppTranslations } from '../i18n/translations';

interface ShiftAlternative {
  trainNumber: string;
  trainName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  timeDifferenceMinutes: number;
  vacantClasses: string[];
  crowdForecast: 'LOW' | 'MODERATE' | 'HIGH';
  confirmationProbabilityPercentage: number;
  shiftConfidenceScore: number;
  shiftReason: string;
  comfortGainPercentage: number;
  routeHighlight: string;
}

interface CoachShiftAdvice {
  currentCoach: string;
  recommendedCoach: string;
  crowdReductionPercentage: number;
  reason: string;
}

interface ShiftResult {
  evaluationId: string;
  primaryShiftAdvice: string;
  urgencyLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  alternatives: ShiftAlternative[];
  coachShift?: CoachShiftAdvice;
  shiftActionSteps: string[];
  mandatoryDisclaimer: string;
}

interface ShiftAdvisorProps {
  t: AppTranslations;
  apiBaseUrl: string;
  lang: string;
  initialTrainNumber?: string;
}

export const ShiftAdvisor: React.FC<ShiftAdvisorProps> = ({ t, apiBaseUrl, lang, initialTrainNumber = '' }) => {
  const [currentTrainId, setCurrentTrainId] = useState(initialTrainNumber);
  const [ticketStatus, setTicketStatus] = useState('WL');
  const [currentCoach, setCurrentCoach] = useState('S3');
  const [crowdLevel, setCrowdLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'>('HIGH');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ShiftResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleComputeShift = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/shift/recommend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': lang
        },
        body: JSON.stringify({
          currentTrainId,
          ticketStatus,
          currentCoach,
          crowdLevel,
          lang
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t.networkError);
      }

      setResult(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.networkError;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tab-panel" aria-labelledby="shift-heading" role="tabpanel">
      <div className="panel-header">
        <h2 id="shift-heading">{t.shiftTitle}</h2>
        <p className="panel-subtitle">{t.shiftSubtitle}</p>
      </div>

      <form className="app-card form-grid" onSubmit={handleComputeShift} aria-label="Shift Calculator Form">
        <div className="form-group">
          <label htmlFor="shift-train-id">{t.shiftCurrentTrain}</label>
          <input
            id="shift-train-id"
            type="text"
            className="form-input"
            value={currentTrainId}
            onChange={e => setCurrentTrainId(e.target.value)}
            placeholder="e.g., 99011 Shift Express"
          />
        </div>

        <div className="form-group">
          <label htmlFor="shift-ticket-status">{t.shiftTicketStatus}</label>
          <select
            id="shift-ticket-status"
            className="form-select"
            value={ticketStatus}
            onChange={e => setTicketStatus(e.target.value)}
          >
            <option value="WL">{t.statusWl}</option>
            <option value="RAC">{t.statusRac}</option>
            <option value="CNF">{t.statusCnf}</option>
            <option value="GENERAL">{t.statusGeneral}</option>
            <option value="TATKAL">{t.statusTatkal}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="shift-coach">{t.shiftCurrentCoach}</label>
          <input
            id="shift-coach"
            type="text"
            className="form-input"
            value={currentCoach}
            onChange={e => setCurrentCoach(e.target.value)}
            placeholder="e.g., S3, B1, D2"
            maxLength={6}
          />
        </div>

        <div className="form-group">
          <label htmlFor="shift-crowd">{t.shiftCrowdObserved}</label>
          <select
            id="shift-crowd"
            className="form-select"
            value={crowdLevel}
            onChange={e => setCrowdLevel(e.target.value as any)}
          >
            <option value="LOW">{t.crowdLow}</option>
            <option value="MEDIUM">{t.crowdMedium}</option>
            <option value="HIGH">{t.crowdHigh}</option>
            <option value="EXTREME">{t.crowdExtreme}</option>
          </select>
        </div>

        <div className="form-actions full-width">
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? `⏳ ${t.calculatingShift}` : `⚡ ${t.calculateShiftButton}`}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert-box error" role="alert" aria-live="assertive">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="shift-results-container" aria-live="polite">
          {/* Primary Advice Banner */}
          <div className={`shift-advice-card urgency-${result.urgencyLevel.toLowerCase()}`}>
            <div className="advice-badge-row">
              <span className={`urgency-badge badge-${result.urgencyLevel.toLowerCase()}`}>
                {t.urgencyLabel}: {result.urgencyLevel}
              </span>
              <span className="demo-tag">{t.trainBadge}</span>
            </div>
            <p className="primary-advice-text">{result.primaryShiftAdvice}</p>
          </div>

          {/* Coach Level Shift Advice */}
          {result.coachShift && (
            <div className="app-card coach-shift-card">
              <h3>🔄 {t.coachShiftRecommendation}</h3>
              <div className="coach-shift-flex">
                <div className="coach-pill current">
                  <span>Current: <strong>{result.coachShift.currentCoach}</strong></span>
                </div>
                <div className="shift-arrow">➔</div>
                <div className="coach-pill recommended">
                  <span>Shift To: <strong>{result.coachShift.recommendedCoach}</strong></span>
                </div>
              </div>
              <p className="coach-shift-reason">{result.coachShift.reason}</p>
              <div className="gain-metric">
                📉 <strong>{result.coachShift.crowdReductionPercentage}%</strong> lower congestion expected
              </div>
            </div>
          )}

          {/* Alternative Trains List */}
          <div className="alternatives-section">
            <h3>🚆 {t.recommendedAlternatives}</h3>
            <div className="alternatives-grid">
              {result.alternatives.map(alt => (
                <div key={alt.trainNumber} className="app-card alternative-train-card">
                  <div className="alt-card-header">
                    <div>
                      <h4 className="alt-train-title">{alt.trainName}</h4>
                      <span className="alt-train-number">#{alt.trainNumber}</span>
                    </div>
                    <div className="shift-score-circle" title={t.shiftScoreLabel}>
                      <span className="score-number">{alt.shiftConfidenceScore}%</span>
                      <span className="score-text">Match</span>
                    </div>
                  </div>

                  <div className="alt-metrics-row">
                    <div className="metric-chip">
                      <span className="chip-label">{t.departs}</span>
                      <span className="chip-value">{alt.departureTime}</span>
                    </div>
                    <div className="metric-chip">
                      <span className="chip-label">{t.duration}</span>
                      <span className="chip-value">{alt.duration}</span>
                    </div>
                    <div className="metric-chip">
                      <span className="chip-label">{t.confirmationBoostLabel}</span>
                      <span className="chip-value high-prob">{alt.confirmationProbabilityPercentage}%</span>
                    </div>
                    <div className="metric-chip">
                      <span className="chip-label">{t.comfortGainLabel}</span>
                      <span className="chip-value comfort-gain">+{alt.comfortGainPercentage}%</span>
                    </div>
                  </div>

                  <p className="alt-reason">💡 {alt.shiftReason}</p>
                  <div className="alt-vacant-classes">
                    <strong>{t.availableClasses}:</strong> {alt.vacantClasses.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Checklist */}
          <div className="app-card checklist-card">
            <h3>📋 {t.actionChecklist}</h3>
            <ul className="checklist-items">
              {result.shiftActionSteps.map((step, idx) => (
                <li key={idx} className="checklist-item">
                  <span className="step-num">{idx + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <p className="disclaimer-note" role="note">
            ℹ️ {result.mandatoryDisclaimer}
          </p>
        </div>
      )}
    </section>
  );
};
