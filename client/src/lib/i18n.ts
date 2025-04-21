import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../locales/en.json';
import esTranslation from '../locales/es.json';

// Inicializa i18next
i18n
  // Detecta el idioma del navegador
  .use(LanguageDetector)
  // Integra con React
  .use(initReactI18next)
  // Configura i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      es: {
        translation: esTranslation
      }
    },
    // Idioma por defecto (español)
    fallbackLng: 'es',
    // Permitir claves anidadas
    interpolation: {
      escapeValue: false,
    },
    // Detecta el idioma del navegador pero prefiere español
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'language',
      caches: ['localStorage']
    }
  });

export default i18n;