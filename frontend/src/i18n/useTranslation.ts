import { useState, useEffect } from 'react';
import { SupportedLanguage, translations, LANGUAGES, LanguageInfo, AppTranslations } from './translations';

export function useTranslation() {
  const [lang, setLang] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('shifttrain_lang');
    if (saved && (saved in translations)) {
      return saved as SupportedLanguage;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('shifttrain_lang', lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const currentLanguageInfo: LanguageInfo = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  const t: AppTranslations = translations[lang] || translations.en;

  return {
    lang,
    setLang,
    t,
    currentLanguageInfo,
    availableLanguages: LANGUAGES
  };
}
