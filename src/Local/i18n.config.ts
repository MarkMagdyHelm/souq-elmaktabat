import ar from './ar';
import en from './en';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {store} from '../Store/store';
const langauge = store.getState().settings.langauge;


i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  resources: {
    ar: {
      translation: ar,
    },
    en: {
      translation: en,
    },
  },
  lng: langauge,
//   languages: [ 'en' ]
debug: false,
  fallbackLng: langauge,
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
