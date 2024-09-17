import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import english from '../utils/languages/en.json';
import french from '../utils/languages/fr.json';
import portugues from '../utils/languages/pt.json';

const resources = {
  en: {
    translation: english,
  },
  fr: {
    translation: french,
  },
  pt: {
    translation: portugues,
  },
};

i18n
  .use(initReactI18next) 
  .init({
    resources,
    lng: 'pt',
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
