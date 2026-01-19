
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { COUNTRIES, Country, Language, TRANSLATIONS } from '../config/localizationData';

interface LanguageContextType {
  selectedCountry: Country;
  selectedLanguage: Language;
  language: string; 
  setCountry: (countryCode: string) => void;
  setLanguage: (langCode: string) => void;
  t: (key: string, defaultText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const india = COUNTRIES.find(c => c.code === 'IN') || COUNTRIES[0];
  const hindi = india.languages.find(l => l.code === 'hi') || india.languages[0];

  const [selectedCountry, setSelectedCountryState] = useState<Country>(india);
  const [selectedLanguage, setSelectedLanguageState] = useState<Language>(hindi);

  // Apply Font and Direction based on language
  useEffect(() => {
    const langCode = selectedLanguage.code.split('-')[0]; // get 'hi', 'ar', etc.
    document.body.className = `lang-${langCode}`;
    
    // Set HTML dir for Arabic
    if (langCode === 'ar') {
        document.documentElement.dir = 'rtl';
    } else {
        document.documentElement.dir = 'ltr';
    }
  }, [selectedLanguage]);

  useEffect(() => {
    const savedCountry = localStorage.getItem('sarthi_country');
    const savedLang = localStorage.getItem('sarthi_lang');
    
    if (savedCountry) {
        const country = COUNTRIES.find(c => c.code === savedCountry);
        if (country) {
            setSelectedCountryState(country);
            if (savedLang) {
                const lang = country.languages.find(l => l.code === savedLang);
                if (lang) setSelectedLanguageState(lang);
            }
        }
    }
  }, []);

  const setCountry = (countryCode: string) => {
    const country = COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountryState(country);
      const initialLang = country.languages[0];
      setSelectedLanguageState(initialLang);
      localStorage.setItem('sarthi_country', countryCode);
      localStorage.setItem('sarthi_lang', initialLang.code);
    }
  };

  const setLanguage = (langCode: string) => {
    const lang = selectedCountry.languages.find(l => l.code === langCode);
    if (lang) {
      setSelectedLanguageState(lang);
      localStorage.setItem('sarthi_lang', langCode);
    }
  };

  const t = useCallback((key: string, defaultText: string) => {
      const langCode = selectedLanguage.code;
      const baseCode = langCode.split('-')[0];
      
      // Check full code first (en-IN), then base code (hi, ar)
      const langDict = TRANSLATIONS[langCode] || TRANSLATIONS[baseCode];
      
      if (langDict && langDict[key]) {
          return langDict[key];
      }
      return defaultText;
  }, [selectedLanguage]);

  return (
    <LanguageContext.Provider value={{ 
        selectedCountry, 
        selectedLanguage, 
        language: selectedLanguage.code, 
        setCountry, 
        setLanguage, 
        t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
