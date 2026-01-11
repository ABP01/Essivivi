"use client";

import { useMemo } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

const LOCALES: Record<string, Record<string, string>> = {
  en,
  fr,
};

export function useTranslation() {
  const { lang } = useLanguage();

  const t = useMemo(() => {
    return (key: string, fallback?: string) => {
      const dict = LOCALES[lang] || LOCALES['fr'];
      return dict[key] ?? fallback ?? key;
    };
  }, [lang]);

  return { t, lang } as const;
}

export default useTranslation;
