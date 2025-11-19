"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "@/locales/locale";

const TranslationContext = createContext();

export const TranslationProvider = ({ children }) => {
  const [locale, setLocale] = useState("uk");
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasSeenTooltip, setHasSeenTooltip] = useState(false);

  useEffect(() => {
    // Завжди починаємо з української мови
    // Check if we're in browser environment
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem("locale");
      if (savedLocale && translations[savedLocale]) {
        setLocale(savedLocale);
      } else {
        setLocale("uk");
        localStorage.setItem("locale", "uk");
      }
    } else {
      setLocale("uk");
    }
    setIsInitialized(true);
  }, []);

  const t = (key) => {
    return translations[locale]?.[key] || key;
  };

  const changeLanguage = (newLocale) => {
    console.log("Changing language to:", newLocale);
    if (translations[newLocale]) {
      setLocale(newLocale);
      if (typeof window !== 'undefined') {
        localStorage.setItem("locale", newLocale);
      }
    }
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <TranslationContext.Provider value={{ t, locale, changeLanguage, hasSeenTooltip, setHasSeenTooltip }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider");
  }
  return context;
};