"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setLang('fr')}
        className={`px-2 py-1 rounded ${lang === 'fr' ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>
        FR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-transparent'}`}>
        EN
      </button>
    </div>
  );
};

export default LanguageSelector;
