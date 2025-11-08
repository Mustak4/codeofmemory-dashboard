import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Language, defaultLanguage, getLanguageFromPath, getLocalizedPath, removeLanguageFromPath } from "@/i18n/config";
import enTranslations from "@/i18n/en.json";
import deTranslations from "@/i18n/de.json";
import svTranslations from "@/i18n/sv.json";
import noTranslations from "@/i18n/no.json";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number> & { returnObjects?: boolean }) => string | any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

const translations: Record<Language, typeof enTranslations> = {
  en: enTranslations,
  de: deTranslations,
  sv: svTranslations,
  no: noTranslations,
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguageState] = useState<Language>(() => {
    return getLanguageFromPath(location.pathname);
  });

  // Update language when pathname changes
  useEffect(() => {
    const newLang = getLanguageFromPath(location.pathname);
    setLanguageState(newLang);
    document.documentElement.lang = newLang;
  }, [location.pathname]);

  const setLanguage = (lang: Language) => {
    const currentPath = removeLanguageFromPath(location.pathname);
    const newPath = getLocalizedPath(currentPath, lang);
    setLanguageState(lang);
    document.documentElement.lang = lang;
    navigate(newPath);
  };

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number | boolean> & { returnObjects?: boolean }): string | any => {
      const translationMap = translations[language];
      const returnObjects = params?.returnObjects || false;
      const cleanParams = params ? { ...params } : {};
      delete cleanParams.returnObjects;
      
      // Navigate through nested keys (e.g., "common.home")
      const keys = key.split(".");
      let translation: any = translationMap;
      
      for (const k of keys) {
        translation = translation?.[k];
        if (translation === undefined) break;
      }
      
      // If returnObjects is true, return the object/array directly
      if (returnObjects && (typeof translation === "object" || Array.isArray(translation))) {
        return translation || {};
      }
      
      let result = typeof translation === "string" ? translation : key;
      
      // Replace parameters
      if (cleanParams && Object.keys(cleanParams).length > 0) {
        Object.entries(cleanParams).forEach(([paramKey, value]) => {
          result = result.replace(`{{${paramKey}}}`, String(value));
        });
      }
      
      return result;
    };
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

