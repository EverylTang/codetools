"use client";

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { translations, Locale, Translation } from "@/lib/i18n/translations";

interface I18nContextType {
  locale: Locale;
  t: Translation;
  setLocale: (locale: Locale) => void;
}

const LOCALE_KEY = "json2code_locale";

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  t: translations.en,
  setLocale: () => {},
});

function detectLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = window.localStorage.getItem(LOCALE_KEY);
  if (saved === "zh" || saved === "en") return saved;
  const nav = navigator.languages?.[0] || navigator.language || "en";
  return nav.startsWith("zh") ? "zh" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  const setLocale = (nextLocale: Locale) => {
    setLocaleState(nextLocale);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_KEY, nextLocale);
      document.documentElement.lang = nextLocale === "zh" ? "zh-CN" : "en";
    }
  };

  const t = translations[locale];
  const value = useMemo(() => ({ locale, t, setLocale }), [locale, t]);

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
