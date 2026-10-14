import React, { useState } from 'react';
import { AppTranslations } from '../i18n/translations';

interface DemoTrain {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: string[];
  runningDays: string[];
  crowdLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  punctualityScore?: number;
  shiftAlternativeTrainNumber?: string;
  isDemo: boolean;
  label: string;
}

interface TrainSearchProps {
  t: AppTranslations;
  apiBaseUrl: string;
  lang: string;
  onSelectTrainForShift?: (trainNumber: string) => void;
}

const POPULAR_ROUTES = [
  { from: 'NDLS - New Delhi', to: 'BCT - Mumbai Central' },
  { from: 'HWH - Howrah', to: 'PNBE - Patna Jn' },
  { from: 'SBC - Bengaluru City', to: 'MAS - Chennai Central' },
];

export const TrainSearch: React.FC<TrainSearchProps> = ({ t, apiBaseUrl, lang, onSelectTrainForShift }) => {
  const [fromStation, setFromStation] = useState('NDLS - New Delhi');
  const [toStation, setToStation] = useState('BCT - Mumbai Central');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [trains, setTrains] = useState<DemoTrain[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const classParam = selectedClass ? `&class=${encodeURIComponent(selectedClass)}` : '';
      const url = `${apiBaseUrl}/api/trains/search?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}&date=${encodeURIComponent(date)}&lang=${encodeURIComponent(lang)}${classParam}`;
      const res = await fetch(url, {
        headers: {
          'Accept-Language': lang
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setTrains(data.trains || []);
    } catch {
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  const getCrowdPillClass = (level?: string) => {
    switch (level) {
      case 'LOW': return 'badge-green';
      case 'MEDIUM': return 'badge-yellow';
      case 'HIGH': return 'badge-orange';
      case 'EXTREME': return 'badge-red';
      default: return 'badge-gray';
    }
  };

  return (
    <section className="tab-panel" aria-labelledby="search-heading" role="tabpanel">
      <div className="panel-header">
        <h2 id="search-heading">🔍 {t.searchTitle}</h2>
      </div>

      {/* Quick Corridor Selection Buttons */}
      <div className="corridor-pills-row" role="group" aria-label="Popular Corridors">
        {POPULAR_ROUTES.map((route, i) => (
          <button
            key={i}
            type="button"
            className="route-pill-btn"
            onClick={() => {
              setFromStation(route.from);
              setToStation(route.to);
            }}
          >
            🚆 {route.from.split(' - ')[0]} ➔ {route.to.split(' - ')[0]}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="app-card form-grid" aria-label="Train Search Form">
        <div className="form-group">
          <label htmlFor="from-station">{t.fromStation}</label>
          <input
            id="from-station"
            type="text"
            value={fromStation}
            onChange={(e) => setFromStation(e.target.value)}
            required
            className="form-input"
            placeholder="e.g. NDLS - New Delhi"
          />
        </div>

        <div className="form-group">
          <label htmlFor="to-station">{t.toStation}</label>
          <input
            id="to-station"
            type="text"
            value={toStation}
            onChange={(e) => setToStation(e.target.value)}
            required
            className="form-input"
            placeholder="e.g. BCT - Mumbai Central"
          />
        </div>

        <div className="form-group">
          <label htmlFor="journey-date">{t.journeyDate}</label>
          <input
            id="journey-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="class-filter">{t.classFilter}</label>
          <select
            id="class-filter"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="form-select"
          >
            <option value="">{t.allClasses}</option>
            <option value="1A">1A (First AC)</option>
            <option value="2A">2A (Second AC)</option>
            <option value="3A">3A (Third AC)</option>
            <option value="EC">EC (Executive Chair Car)</option>
            <option value="CC">CC (AC Chair Car)</option>
            <option value="SL">SL (Sleeper)</option>
            <option value="2S">2S (Second Sitting)</option>
          </select>
        </div>

        <div className="form-actions full-width">
          <button type="submit" disabled={loading} className="primary-btn" aria-busy={loading}>
            {loading ? `⏳ ${t.searching}` : `🔍 ${t.searchButton}`}
          </button>
        </div>
      </form>

      {error && (
        <div className="alert-box error" role="alert" aria-live="assertive">
          ⚠️ {error}
        </div>
      )}

      {searched && (
        <div className="search-results-section" aria-live="polite">
          <div className="results-header-row">
            <h3>Available Trains ({trains.length})</h3>
            <span className="demo-tag">{t.trainBadge}</span>
          </div>

          {trains.length === 0 ? (
            <p className="no-data-notice">{t.noTrainsFound}</p>
          ) : (
            <div className="trains-grid">
              {trains.map((train) => (
                <div key={train.trainNumber} className="app-card train-card">
                  <div className="train-card-top">
                    <div>
                      <h4 className="train-title">{train.trainName}</h4>
                      <span className="train-meta-number">#{train.trainNumber}</span>
                    </div>
                    {train.crowdLevel && (
                      <span className={`crowd-pill ${getCrowdPillClass(train.crowdLevel)}`} title={t.crowdLevelIndicator}>
                        {train.crowdLevel}
                      </span>
                    )}
                  </div>

                  <div className="schedule-flex">
                    <div className="schedule-node">
                      <span className="time">{train.departureTime}</span>
                      <span className="station">{train.source}</span>
                    </div>
                    <div className="duration-arrow">
                      <span className="duration-text">{train.duration}</span>
                      <div className="line" />
                    </div>
                    <div className="schedule-node">
                      <span className="time">{train.arrivalTime}</span>
                      <span className="station">{train.destination}</span>
                    </div>
                  </div>

                  <div className="train-details-row">
                    <div className="details-col">
                      <span className="detail-label">{t.runsOn}:</span>
                      <span className="detail-value">{train.runningDays.join(', ')}</span>
                    </div>
                    {train.punctualityScore !== undefined && (
                      <div className="details-col">
                        <span className="detail-label">{t.punctuality}:</span>
                        <span className="detail-value punctuality-score">{train.punctualityScore}%</span>
                      </div>
                    )}
                  </div>

                  <div className="classes-row">
                    <span className="detail-label">{t.availableClasses}:</span>
                    <div className="classes-chips">
                      {train.classes.map((cls) => (
                        <span key={cls} className="class-chip">{cls}</span>
                      ))}
                    </div>
                  </div>

                  {/* Shift Recommendation Trigger Button */}
                  {onSelectTrainForShift && (train.crowdLevel === 'EXTREME' || train.crowdLevel === 'HIGH' || train.shiftAlternativeTrainNumber) && (
                    <div className="shift-card-action">
                      <button
                        type="button"
                        className="shift-suggest-btn"
                        onClick={() => onSelectTrainForShift(train.trainNumber)}
                        aria-label={`View Shift Train alternatives for ${train.trainName}`}
                      >
                        {t.suggestedShift}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
