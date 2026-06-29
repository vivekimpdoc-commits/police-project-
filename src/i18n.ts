import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Placeholder for Hindi and English translations
const resources = {
  en: {
    translation: {
      "welcome": "Welcome to PNO",
      // Add more English strings here
    }
  },
  hi: {
    translation: {
      "welcome": "पीएनओ में आपका स्वागत है",
      // Add more Hindi strings here
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
