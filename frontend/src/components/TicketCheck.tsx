import React, { useState } from 'react';
import { AppTranslations } from '../i18n/translations';

interface TicketEvaluation {
  status: string;
  isEligibleToBoard: boolean;
  berthAllotmentRule: string;
  cancellationRule: string;
  mandatoryAdvice: string;
  isDemoRuleEngine: boolean;
  summary: string;
}

interface TicketCheckProps {
  t: AppTranslations;
  apiBaseUrl: string;
  lang: string;
}

export const TicketCheck: React.FC<TicketCheckProps> = ({ t, apiBaseUrl, lang }) => {
  const [pnr, setPnr] = useState('241-8901234');
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

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setEvaluation(data.evaluation || null);
    } catch (err: any) {
      console.error('Ticket check error:', err);
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">🎫 {t.ticketTitle}</h2>
        <p className="section-desc">{t.ticketSubtitle}</p>
      </div>

      <form onSubmit={handleCheck} className="ticket-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="pnr-input" className="form-label">{t.pnrNumber}</label>
            <input
              id="pnr-input"
              type="text"
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
              className="form-input"
              placeholder="e.g. 10 digit PNR"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ticket-status-select" className="form-label">{t.ticketStatus}</label>
            <select
              id="ticket-status-select"
              value={ticketStatus}
              onChange={(e) => setTicketStatus(e.target.value)}
              className="form-input"
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
            <label htmlFor="coach-opt-input" className="form-label">{t.coachNumber} (Optional)</label>
            <input
              id="coach-opt-input"
              type="text"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              className="form-input"
              placeholder="e.g. B2, S4"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? t.checking : t.checkTicketButton}
        </button>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {evaluation && (
        <div className="evaluation-card">
          <div className="eval-status-row">
            <div className={`status-pill ${evaluation.isEligibleToBoard ? 'eligible' : 'ineligible'}`}>
              {evaluation.isEligibleToBoard ? `✓ ${t.eligibleToBoard}` : `✕ ${t.notEligibleToBoard}`}
            </div>
            <span className="eval-badge">Status: {evaluation.status}</span>
          </div>

          <div className="eval-rules">
            <div className="rule-item">
              <span className="rule-heading">📌 {t.berthRule}</span>
              <p className="rule-content">{evaluation.berthAllotmentRule}</p>
            </div>

            <div className="rule-item">
              <span className="rule-heading">🔄 {t.cancellationRule}</span>
              <p className="rule-content">{evaluation.cancellationRule}</p>
            </div>

            <div className="mandatory-advice-box">
              <span className="advice-title">⚠️ {t.mandatoryAdvice}</span>
              <p className="advice-text">{evaluation.mandatoryAdvice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
