import { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import etTranslations from '../locales/et.json';

const LanguageContext = createContext();

const translations = {
  en: enTranslations,
  et: etTranslations,
};

const SUPPORTED_LANGUAGES = ['en', 'et'];
const DEFAULT_LANGUAGE = 'en';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (SUPPORTED_LANGUAGES.includes(newLanguage)) {
      setLanguage(newLanguage);
    }
  };

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];

    for (const k of keys) {
      value = value?.[k];
    }

    return value || key;
  };

  const getCurrentLanguageCode = () => language;
  const getCurrentLanguageName = () => translations[language]?.language || language;

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
        getCurrentLanguageCode,
        getCurrentLanguageName,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
