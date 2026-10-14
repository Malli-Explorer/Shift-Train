import React from 'react';
import { AppTranslations, SupportedLanguage, LanguageInfo } from '../i18n/translations';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  t: AppTranslations;
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  languages: LanguageInfo[];
}

export const Header: React.FC<HeaderProps> = ({
  t,
  currentLang,
  onSelectLang,
  languages
}) => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="logo-icon">🚆</div>
        <div>
          <h1 className="brand-title">{t.appTitle}</h1>
          <p className="brand-subtitle">{t.appSubtitle}</p>
        </div>
      </div>
      <LanguageSelector
        currentLang={currentLang}
        onSelectLang={onSelectLang}
        languages={languages}
      />
    </header>
  );
};
