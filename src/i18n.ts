import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { logError, logEvent, EventType } from './lib/monitoring';

// Supported languages
export const SUPPORTED_LANGUAGES = ['en', 'fr'];
export const DEFAULT_LANGUAGE = 'en';

// Initialize i18next
i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES,
    defaultNS: 'common',
    ns: ['common'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      requestOptions: {
        cache: 'default',
      },
    },
    react: {
      useSuspense: true,
    },
    // Handle missing translations
    saveMissing: process.env.NODE_ENV === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng} in namespace: ${ns}`);
      }
      logEvent(EventType.WARNING, 'Missing translation', { key, language: lng, namespace: ns });
    },
  })
  .catch(error => {
    logError(error, { context: 'i18n initialization' });
  });

// Add language change event handler
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'; // Handle RTL languages
  logEvent(EventType.INFO, 'Language changed', { language: lng });
});

// Helper function to get browser language
export const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.split('-')[0];
  return SUPPORTED_LANGUAGES.includes(browserLang) ? browserLang : DEFAULT_LANGUAGE;
};

// Helper function to get all available translations for a key
export const getAllTranslations = (key: string): Record<string, string> => {
  const translations: Record<string, string> = {};
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    const translation = i18n.getFixedT(lang)(key);
    if (translation !== key) { // Only add if translation exists
      translations[lang] = translation;
    }
  });
  
  return translations;
};

// Helper function to check if a translation exists
export const hasTranslation = (key: string, lng?: string): boolean => {
  const language = lng || i18n.language;
  return i18n.exists(key, { lng: language });
};

// Export i18n instance
export default i18n;