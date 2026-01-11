"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Lang = 'fr' | 'en';

type LanguageContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('fr');

  useEffect(() => {
    // try to read saved preference
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('essivi_lang') : null;
      if (saved === 'en' || saved === 'fr') setLang(saved);
      else if (typeof navigator !== 'undefined') {
        const nav = navigator.language?.startsWith('en') ? 'en' : 'fr';
        setLang(nav as Lang);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('essivi_lang', lang);
    } catch (e) {}
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export default LanguageContext;
