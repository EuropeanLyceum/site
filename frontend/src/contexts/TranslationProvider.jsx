"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { translations } from "@/locales";

const DEFAULT_LOCALE = "uk";

const TranslationContext = createContext(null);

export const TranslationProvider = ({ children }) => {
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasSeenTooltip, setHasSeenTooltip] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedLocale = localStorage.getItem("locale");

    if (savedLocale && translations[savedLocale]) {
      setLocale(savedLocale);
    } else {
      localStorage.setItem("locale", DEFAULT_LOCALE);
    }

    setIsInitialized(true);
  }, []);

  const changeLanguage = (newLocale) => {
    if (!translations[newLocale]) return;

    setLocale(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  const t = (key) => {
    return translations[locale]?.[key] ?? key;
  };

  if (!isInitialized) return null;

  return (
      <TranslationContext.Provider
          value={{
            locale,
            t,
            changeLanguage,
            hasSeenTooltip,
            setHasSeenTooltip,
          }}
      >
        {children}
      </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error(
        "useTranslation must be used within TranslationProvider"
    );
  }
  return context;
};