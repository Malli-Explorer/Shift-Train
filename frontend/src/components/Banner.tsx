import React from 'react';
import { AppTranslations, LanguageInfo } from '../i18n/translations';

interface BannerProps {
  t: AppTranslations;
  languageInfo: LanguageInfo;
}

export const Banner: React.FC<BannerProps> = ({ t, languageInfo }) => {
  return (
    <aside aria-label="Demo notice banner" className="demo-banner-wrapper">
      <div className="demo-banner">
        <div className="demo-banner-badge">DEMO DATA</div>
        <div className="demo-banner-content">
          <strong className="demo-banner-title">{t.demoBanner}</strong>
          <span className="demo-banner-sub">{t.demoBannerSubtitle}</span>
        </div>
      </div>
      {languageInfo.isPartial && (
        <div className="partial-banner">
          ⚠️ {t.partialNotice}
        </div>
      )}
    </aside>
  );
};
