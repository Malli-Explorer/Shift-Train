import React, { useState } from 'react';
import { useTranslation } from './i18n/useTranslation';
import { Banner } from './components/Banner';
import { Header } from './components/Header';
import { TrainSearch } from './components/TrainSearch';
import { ShiftAdvisor } from './components/ShiftAdvisor';
import { StationAwareness } from './components/StationAwareness';
import { CrowdReport } from './components/CrowdReport';
import { TicketCheck } from './components/TicketCheck';

export type AppTab = 'search' | 'shift' | 'station' | 'crowd' | 'ticket';

export const App: React.FC = () => {
  const { lang, setLang, t, currentLanguageInfo, availableLanguages } = useTranslation();
  const [activeTab, setActiveTab] = useState<AppTab>('search');
  const [selectedShiftTrain, setSelectedShiftTrain] = useState<string>('');

  // API Base URL from env or fallback to Render backend in production
  const apiBaseUrl = (
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? 'https://shifttrain-backend.onrender.com' : '')
  ).replace(/\/$/, '');

  const handleSelectTrainForShift = (trainNumber: string) => {
    setSelectedShiftTrain(trainNumber);
    setActiveTab('shift');
  };

  const handleNavigateToShiftFromTicket = () => {
    setActiveTab('shift');
  };

  return (
    <div className="app-container">
      {/* Banner is present on all pages / tabs */}
      <Banner t={t} languageInfo={currentLanguageInfo} />

      <div className="app-content-wrapper">
        <Header
          t={t}
          currentLang={lang}
          onSelectLang={setLang}
          languages={availableLanguages}
        />

        {/* Tab Navigation with Full ARIA Accessibility */}
        <nav className="tab-navigation" role="tablist" aria-label="Main Navigation">
          <button
            role="tab"
            id="tab-search"
            aria-controls="panel-search"
            aria-selected={activeTab === 'search'}
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 {t.tabSearch}
          </button>
          <button
            role="tab"
            id="tab-shift"
            aria-controls="panel-shift"
            aria-selected={activeTab === 'shift'}
            className={`tab-btn ${activeTab === 'shift' ? 'active' : ''}`}
            onClick={() => setActiveTab('shift')}
          >
            ⚡ {t.tabShift}
          </button>
          <button
            role="tab"
            id="tab-station"
            aria-controls="panel-station"
            aria-selected={activeTab === 'station'}
            className={`tab-btn ${activeTab === 'station' ? 'active' : ''}`}
            onClick={() => setActiveTab('station')}
          >
            🏢 {t.tabStation}
          </button>
          <button
            role="tab"
            id="tab-crowd"
            aria-controls="panel-crowd"
            aria-selected={activeTab === 'crowd'}
            className={`tab-btn ${activeTab === 'crowd' ? 'active' : ''}`}
            onClick={() => setActiveTab('crowd')}
          >
            👥 {t.tabCrowd}
          </button>
          <button
            role="tab"
            id="tab-ticket"
            aria-controls="panel-ticket"
            aria-selected={activeTab === 'ticket'}
            className={`tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
            onClick={() => setActiveTab('ticket')}
          >
            🎫 {t.tabTicket}
          </button>
        </nav>

        {/* Active Tab Live Announcement for Screen Readers */}
        <div className="sr-only" aria-live="polite">
          Active tab: {activeTab}
        </div>

        {/* Tab Panels */}
        <main className="tab-content-area" id={`panel-${activeTab}`}>
          {activeTab === 'search' && (
            <TrainSearch
              t={t}
              apiBaseUrl={apiBaseUrl}
              lang={lang}
              onSelectTrainForShift={handleSelectTrainForShift}
            />
          )}

          {activeTab === 'shift' && (
            <ShiftAdvisor
              t={t}
              apiBaseUrl={apiBaseUrl}
              lang={lang}
              initialTrainNumber={selectedShiftTrain}
            />
          )}

          {activeTab === 'station' && (
            <StationAwareness
              t={t}
              apiBaseUrl={apiBaseUrl}
              lang={lang}
            />
          )}

          {activeTab === 'crowd' && (
            <CrowdReport
              t={t}
              apiBaseUrl={apiBaseUrl}
              lang={lang}
            />
          )}

          {activeTab === 'ticket' && (
            <TicketCheck
              t={t}
              apiBaseUrl={apiBaseUrl}
              lang={lang}
              onNavigateToShift={handleNavigateToShiftFromTicket}
            />
          )}
        </main>

        <footer className="app-footer" role="contentinfo">
          <p>
            <strong>ShiftTrain AI</strong> • Next-Generation Commuter Intelligence & Station Awareness.
          </p>
          <p className="footer-disclaimer">
            All train schedules and rules are fictional simulations for demonstration. In-memory crowd reports reset on server restart. No real IRCTC data.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
