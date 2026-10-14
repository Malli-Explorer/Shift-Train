import React from 'react';
import { SupportedLanguage, LanguageInfo } from '../i18n/translations';

interface LanguageSelectorProps {
  currentLang: SupportedLanguage;
  onSelectLang: (lang: SupportedLanguage) => void;
  languages: LanguageInfo[];
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelectLang,
  languages
}) => {
  return (
    <div className="language-selector">
      <label htmlFor="lang-select" className="lang-label">
        🌐 Language:
      </label>
      <select
        id="lang-select"
        value={currentLang}
        onChange={(e) => onSelectLang(e.target.value as SupportedLanguage)}
        className="lang-dropdown"
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeName} ({item.name}) {item.isPartial ? '• Partial' : ''}
          </option>
        ))}
      </select>
    </div>
  );
};
