import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonFa from './locales/fa/common.json';
import commonEn from './locales/en/common.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fa: { common: commonFa },
      en: { common: commonEn },
    },
    lng: 'fa',
    fallbackLng: 'fa',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  });

// تنظیم جهت و زبان روی <html> هر بار که زبان تغییر کند (شامل بارگذاری اولیه)
const applyDirection = (lng) => {
  document.documentElement.dir = lng === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};

applyDirection(i18n.language);
i18n.on('languageChanged', applyDirection);

export default i18n;
