import { createContext, useState, type ReactNode, type JSX } from "react";
import {
  type Language,
  type Translations,
  translations,
  getSavedLanguage,
  saveLanguage,
} from "./i18n";

interface LanguageContextValue {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps): JSX.Element {
  const [language, setLanguage] = useState<Language>(getSavedLanguage);

  function toggleLanguage(): void {
    setLanguage((prev) => {
      const next = prev === "en" ? "id" : "en";
      saveLanguage(next);
      return next;
    });
  }

  return (
    <LanguageContext.Provider
      value={{ language, t: translations[language], toggleLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
