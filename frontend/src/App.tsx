import React, { useState } from 'react';
import { useTranslation } from './i18n/useTranslation';
import { Banner } from './components/Banner';
import { Header } from './components/Header';
import { TrainSearch } from './components/TrainSearch';
import { CrowdReport } from './components/CrowdReport';
import { TicketCheck } from './components/TicketCheck';

export const App: React.FC = () => {
  const { lang, setLang, t, currentLanguageInfo, availableLanguages } = useTranslation();
  const [activeTab, setActiveTab] = useState<'search' | 'crowd' | 'ticket'>('search');

  // API Base URL from env or empty string (for relative proxy)
  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

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

        {/* Tab Navigation */}
        <nav className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            🔍 {t.tabSearch}
          </button>
          <button
            className={`tab-btn ${activeTab === 'crowd' ? 'active' : ''}`}
            onClick={() => setActiveTab('crowd')}
          >
            👥 {t.tabCrowd}
          </button>
          <button
            className={`tab-btn ${activeTab === 'ticket' ? 'active' : ''}`}
            onClick={() => setActiveTab('ticket')}
          >
            🎫 {t.tabTicket}
          </button>
        </nav>

        {/* Tab Panels */}
        <main className="tab-panel">
          {activeTab === 'search' && (
            <TrainSearch t={t} apiBaseUrl={apiBaseUrl} lang={lang} />
          )}

          {activeTab === 'crowd' && (
            <CrowdReport t={t} apiBaseUrl={apiBaseUrl} lang={lang} />
          )}

          {activeTab === 'ticket' && (
            <TicketCheck t={t} apiBaseUrl={apiBaseUrl} lang={lang} />
          )}
        </main>

        <footer className="app-footer">
          <p>
            <strong>ShiftTrain AI</strong> • Prototype built for demonstration purposes.
          </p>
          <p className="footer-disclaimer">
            All train data is fictional simulation. In-memory crowd reports reset on server restart. No real IRCTC data.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
