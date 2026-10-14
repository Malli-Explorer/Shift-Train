import React, { useState } from 'react';
import { AppTranslations } from '../i18n/translations';

interface TicketEvaluation {
  status: string;
  isEligibleToBoard: boolean;
  berthAllotmentRule: string;
  cancellationRule: string;
  chartingRule?: string;
  confirmationProbability?: number;
  recommendedShiftAction?: string;
  mandatoryAdvice: string;
  isDemoRuleEngine: boolean;
  summary: string;
}

interface TicketCheckProps {
  t: AppTranslations;
  apiBaseUrl: string;
  lang: string;
  onNavigateToShift?: (status: string, coach?: string) => void;
}

export const TicketCheck: React.FC<TicketCheckProps> = ({ t, apiBaseUrl, lang, onNavigateToShift }) => {
  const [pnr, setPnr] = useState('2418901234');
  const [ticketStatus, setTicketStatus] = useState('RAC');
  const [coach, setCoach] = useState('B2');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<TicketEvaluation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/ticket/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': lang
        },
        body: JSON.stringify({
          pnr,
          ticketStatus,
          coach,
          lang
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t.networkError);
      }

      setEvaluation(data.evaluation || null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.networkError;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="tab-panel" aria-labelledby="ticket-heading" role="tabpanel">
      <div className="panel-header">
        <h2 id="ticket-heading">🎫 {t.ticketTitle}</h2>
        <p className="panel-subtitle">{t.ticketSubtitle}</p>
      </div>

      <form onSubmit={handleCheck} className="app-card form-grid" aria-label="Ticket Rules Verification Form">
        <div className="form-group">
          <label htmlFor="pnr-input">{t.pnrNumber}</label>
          <input
            id="pnr-input"
            type="text"
            value={pnr}
            onChange={(e) => setPnr(e.target.value)}
            className="form-input"
            placeholder="e.g. 10 digit PNR (2418901234)"
            maxLength={10}
            pattern="\d*"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticket-status-select">{t.ticketStatus}</label>
          <select
            id="ticket-status-select"
            value={ticketStatus}
            onChange={(e) => setTicketStatus(e.target.value)}
            className="form-select"
          >
            <option value="CNF">{t.statusCnf}</option>
            <option value="RAC">{t.statusRac}</option>
            <option value="WL">{t.statusWl}</option>
            <option value="TATKAL">{t.statusTatkal}</option>
            <option value="GENERAL">{t.statusGeneral}</option>
            <option value="CANCELLED">{t.statusCancelled}</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="coach-opt-input">{t.coachNumber} (Optional)</label>
          <input
            id="coach-opt-input"
            type="text"
            value={coach}
            onChange={(e) => setCoach(e.target.value)}
            className="form-input"
            placeholder="e.g. B2, S4"
            maxLength={6}
          />
        </div>

        <div className="form-actions full-width">
          <button type="submit" disabled={loading} className="primary-btn" aria-busy={loading}>
            {loading ? `⏳ ${t.checking}` : `🔍 ${t.checkTicketButton}`}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert-box error" role="alert" aria-live="assertive">
          ⚠️ {error}
        </div>
      )}

      {evaluation && (
        <div className="evaluation-card app-card" aria-live="polite">
          <div className="eval-status-row">
            <div className={`status-pill ${evaluation.isEligibleToBoard ? 'eligible' : 'ineligible'}`}>
              {evaluation.isEligibleToBoard ? `✓ ${t.eligibleToBoard}` : `✕ ${t.notEligibleToBoard}`}
            </div>
            <span className="eval-badge">Status: {evaluation.status}</span>
          </div>

          {/* Confirmation Probability Gauge */}
          {evaluation.confirmationProbability !== undefined && (
            <div className="probability-bar-row">
              <div className="label-flex">
                <span>{t.confirmationProbability}:</span>
                <strong>{evaluation.confirmationProbability}%</strong>
              </div>
              <div className="meter-track" role="progressbar" aria-valuenow={evaluation.confirmationProbability} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="meter-fill"
                  style={{
                    width: `${evaluation.confirmationProbability}%`,
                    backgroundColor: evaluation.confirmationProbability >= 75 ? '#16a34a' : (evaluation.confirmationProbability >= 40 ? '#d97706' : '#dc2626')
                  }}
                />
              </div>
            </div>
          )}

          {/* Recommended Shift Action Card (Especially for WL & RAC) */}
          {evaluation.recommendedShiftAction && (
            <div className="shift-prompt-box">
              <div className="prompt-content">
                <h4>💡 {t.recommendedShiftAction}</h4>
                <p>{evaluation.recommendedShiftAction}</p>
              </div>
              {onNavigateToShift && (evaluation.status.includes('WL') || evaluation.status === 'RAC') && (
                <button
                  type="button"
                  className="shift-shortcut-btn"
                  onClick={() => onNavigateToShift(evaluation.status, coach)}
                >
                  ⚡ Open Shift Advisor
                </button>
              )}
            </div>
          )}

          <div className="eval-rules">
            <div className="rule-item">
              <span className="rule-heading">📌 {t.berthRule}</span>
              <p className="rule-content">{evaluation.berthAllotmentRule}</p>
            </div>

            <div className="rule-item">
              <span className="rule-heading">🔄 {t.cancellationRule}</span>
              <p className="rule-content">{evaluation.cancellationRule}</p>
            </div>

            {evaluation.chartingRule && (
              <div className="rule-item">
                <span className="rule-heading">📊 {t.chartingRule}</span>
                <p className="rule-content">{evaluation.chartingRule}</p>
              </div>
            )}

            <div className="mandatory-advice-box" role="alert">
              <span className="advice-title">⚠️ {t.mandatoryAdvice}</span>
              <p className="advice-text">{evaluation.mandatoryAdvice}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
