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
  isDemo: boolean;
  label: string;
}

interface TrainSearchProps {
  t: AppTranslations;
  apiBaseUrl: string;
  lang: string;
}

export const TrainSearch: React.FC<TrainSearchProps> = ({ t, apiBaseUrl, lang }) => {
  const [fromStation, setFromStation] = useState('NDLS - New Delhi');
  const [toStation, setToStation] = useState('BCT - Mumbai Central');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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
      const url = `${apiBaseUrl}/api/trains/search?from=${encodeURIComponent(fromStation)}&to=${encodeURIComponent(toStation)}&date=${encodeURIComponent(date)}&lang=${encodeURIComponent(lang)}`;
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
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(t.networkError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <h2 className="section-title">🔍 {t.searchTitle}</h2>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="from-station" className="form-label">{t.fromStation}</label>
            <input
              id="from-station"
              type="text"
              value={fromStation}
              onChange={(e) => setFromStation(e.target.value)}
              required
              className="form-input"
              placeholder="e.g. New Delhi"
            />
          </div>

          <div className="form-group">
            <label htmlFor="to-station" className="form-label">{t.toStation}</label>
            <input
              id="to-station"
              type="text"
              value={toStation}
              onChange={(e) => setToStation(e.target.value)}
              required
              className="form-input"
              placeholder="e.g. Mumbai Central"
            />
          </div>

          <div className="form-group">
            <label htmlFor="journey-date" className="form-label">{t.journeyDate}</label>
            <input
              id="journey-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="form-input"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? t.searching : t.searchButton}
        </button>
      </form>

      {error && <div className="alert-error">{error}</div>}

      {searched && !loading && (
        <div className="trains-results">
          {trains.length === 0 ? (
            <p className="no-data">{t.noTrainsFound}</p>
          ) : (
            trains.map((train) => (
              <div key={train.trainNumber} className="train-card">
                <div className="train-card-header">
                  <div>
                    <h3 className="train-name">
                      {train.trainNumber} - {train.trainName}
                    </h3>
                    <span className="route-text">
                      {train.source} ➔ {train.destination}
                    </span>
                  </div>
                  <span className="demo-tag">{train.label || t.trainBadge}</span>
                </div>

                <div className="train-meta-grid">
                  <div className="meta-box">
                    <span className="meta-label">{t.departs}</span>
                    <span className="meta-val">{train.departureTime}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-label">{t.duration}</span>
                    <span className="meta-val">{train.duration}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-label">{t.arrives}</span>
                    <span className="meta-val">{train.arrivalTime}</span>
                  </div>
                  <div className="meta-box">
                    <span className="meta-label">{t.runsOn}</span>
                    <span className="meta-val">{train.runningDays.join(', ')}</span>
                  </div>
                </div>

                <div className="train-classes">
                  <span className="classes-label">{t.availableClasses}:</span>
                  {train.classes.map((cls) => (
                    <span key={cls} className="class-pill">{cls}</span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
