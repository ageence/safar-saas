"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, Language } from "@/lib/i18n/dictionaries";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof dictionaries.fr) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("fr");

  // Charger la langue sauvegardée
  useEffect(() => {
    const savedLang = localStorage.getItem("safar-lang") as Language;
    if (savedLang && ["fr", "en", "ar"].includes(savedLang)) {
      setLang(savedLang);
    }
  }, []);

  // Changer la direction (RTL pour l'arabe)
  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
    localStorage.setItem("safar-lang", lang);
  }, [lang]);

  const t = (key: keyof typeof dictionaries.fr) => {
    return dictionaries[lang][key] || dictionaries.fr[key];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {/* On ajoute une classe si c'est de l'arabe pour changer la police si besoin */}
      <div className={lang === "ar" ? "font-arabic" : ""}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};