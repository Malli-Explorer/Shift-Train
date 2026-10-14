import React, { useState, useEffect, useCallback } from 'react';
import { AppTranslations } from '../i18n/translations';

interface PlatformInfo {
  platformNumber: number;
  expectedCrowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  currentTrain?: string;
  crowdFactorPercentage: number;
  bestBoardingZone: string;
}

interface Facility {
  name: string;
  icon: string;
  location: string;
  isAccessible: boolean;
}

interface StationData {
  stationCode: string;
  stationName: string;
  city: string;
  division: string;
  overallCongestion: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';
  platforms: PlatformInfo[];
  facilities: Facility[];
  safetyGuidelines: string[];
  helplineNumbers: Record<string, string>;
}

interface StationAwarenessProps {
  t: AppTranslations;
  apiBaseUrl: string;
  lang: string;
}

const FEATURED_STATIONS = [
  { code: 'NDLS', name: 'New Delhi (NDLS)' },
  { code: 'BCT', name: 'Mumbai Central (BCT)' },
  { code: 'HWH', name: 'Howrah Junction (HWH)' },
  { code: 'SBC', name: 'KSR Bengaluru (SBC)' }
];

export const StationAwareness: React.FC<StationAwarenessProps> = ({ t, apiBaseUrl }) => {
  const [selectedStation, setSelectedStation] = useState('NDLS');
  const [stationData, setStationData] = useState<StationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStationData = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiBaseUrl}/api/station/${encodeURIComponent(code)}/insights`);
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t.networkError);
      }
      setStationData(data.data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t.networkError;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, t.networkError]);

  useEffect(() => {
    fetchStationData(selectedStation);
  }, [selectedStation, fetchStationData]);

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'var(--success-green, #16a34a)';
      case 'MODERATE': return 'var(--accent-amber, #d97706)';
      case 'HIGH': return 'var(--warning-orange, #ea580c)';
      case 'EXTREME': return 'var(--danger-red, #dc2626)';
      default: return 'var(--accent-blue, #2563eb)';
    }
  };

  return (
    <section className="tab-panel" aria-labelledby="station-heading" role="tabpanel">
      <div className="panel-header">
        <h2 id="station-heading">{t.stationTitle}</h2>
        <p className="panel-subtitle">{t.stationSubtitle}</p>
      </div>

      {/* Station Selector Bar */}
      <div className="app-card selector-card">
        <label htmlFor="station-select" className="selector-label">{t.selectStation}:</label>
        <div className="station-pills" role="radiogroup" aria-label={t.selectStation}>
          {FEATURED_STATIONS.map(stn => (
            <button
              key={stn.code}
              type="button"
              className={`pill-btn ${selectedStation === stn.code ? 'active' : ''}`}
              onClick={() => setSelectedStation(stn.code)}
              aria-pressed={selectedStation === stn.code}
            >
              🏢 {stn.name}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loading-state" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <p>Analyzing live station telemetry & platform radar...</p>
        </div>
      )}

      {error && (
        <div className="alert-box error" role="alert">
          ⚠️ {error}
        </div>
      )}

      {stationData && !loading && (
        <div className="station-content-grid" aria-live="polite">
          {/* Station Overview Banner */}
          <div className="station-overview-card app-card">
            <div className="overview-header">
              <div>
                <h3 className="stn-name">{stationData.stationName} ({stationData.stationCode})</h3>
                <p className="stn-division">Zone: {stationData.division} | City: {stationData.city}</p>
              </div>
              <div className="congestion-pill" style={{ borderColor: getCrowdColor(stationData.overallCongestion) }}>
                <span className="dot" style={{ backgroundColor: getCrowdColor(stationData.overallCongestion) }} />
                <span>Station Rush: <strong>{stationData.overallCongestion}</strong></span>
              </div>
            </div>
          </div>

          {/* Platform Crowd Radar */}
          <div className="app-card platforms-card">
            <h3>📡 {t.platformCongestionTitle}</h3>
            <div className="platforms-grid">
              {stationData.platforms.map(p => (
                <div key={p.platformNumber} className="platform-row">
                  <div className="pf-badge">
                    <span>{t.platformNumberLabel}</span>
                    <strong>#{p.platformNumber}</strong>
                  </div>
                  <div className="pf-info">
                    <div className="pf-train-row">
                      <span className="pf-train">{p.currentTrain || 'Express Clearance'}</span>
                      <span className="pf-level" style={{ color: getCrowdColor(p.expectedCrowdLevel) }}>
                        {p.expectedCrowdLevel} ({p.crowdFactorPercentage}%)
                      </span>
                    </div>
                    {/* Visual Meter */}
                    <div className="meter-track" role="progressbar" aria-valuenow={p.crowdFactorPercentage} aria-valuemin={0} aria-valuemax={100}>
                      <div
                        className="meter-fill"
                        style={{
                          width: `${p.crowdFactorPercentage}%`,
                          backgroundColor: getCrowdColor(p.expectedCrowdLevel)
                        }}
                      />
                    </div>
                    <p className="pf-boarding-hint">
                      🎯 <strong>{t.bestBoardingZoneLabel}:</strong> {p.bestBoardingZone}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Station Amenities & Accessibility */}
          <div className="app-card facilities-card">
            <h3>♿ {t.stationFacilitiesTitle}</h3>
            <div className="facilities-grid">
              {stationData.facilities.map((fac, idx) => (
                <div key={idx} className="facility-item">
                  <span className="facility-icon" aria-hidden="true">{fac.icon}</span>
                  <div>
                    <h4 className="facility-name">{fac.name}</h4>
                    <p className="facility-location">{fac.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency & Safety Column */}
          <div className="station-sidebar-col">
            <div className="app-card safety-card">
              <h3>🛡️ {t.safetyGuidelinesTitle}</h3>
              <ul className="guidelines-list">
                {stationData.safetyGuidelines.map((guide, idx) => (
                  <li key={idx} className="guide-item">
                    <span>⚠️</span>
                    <span>{guide}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="app-card helpline-card">
              <h3>📞 {t.emergencyHelplinesTitle}</h3>
              <div className="helpline-buttons">
                {Object.entries(stationData.helplineNumbers).map(([key, val]) => (
                  <a key={key} href={`tel:${val}`} className="helpline-pill">
                    <span className="helpline-label">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <strong className="helpline-num">{val}</strong>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
