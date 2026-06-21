import { useContext } from "react";
import { LanguageContext } from "@/configs/LanguageContext";
import type { Language, Translations } from "@/configs/i18n";

interface UseLanguageReturn {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
}

export function useLanguage(): UseLanguageReturn {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
