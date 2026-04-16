import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr.json';
import en from './locales/en.json';
import pt from './locales/pt.json';
import ar from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr, public: fr.public },
      en: { translation: en, public: en.public },
      pt: { translation: pt, public: pt.public },
      ar: { translation: ar, public: ar.public },
    },
    fallbackLng: 'fr',
    defaultNS: 'translation',
    ns: ['translation', 'public'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
  });

export default i18n;
