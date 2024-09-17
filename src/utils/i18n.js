import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from '../utils/languages/en.json';
import portugues from '../utils/languages/pt.json';

const resources = {
  pt: {
    translation: portugues,
  },
  en: {
    translation: english,
  },
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: 'pt',
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
