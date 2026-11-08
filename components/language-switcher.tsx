"use client";

import { Globe } from "lucide-react";
import { useLanguage } from "./language-provider";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="relative group z-50">
      <button className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-slate-600 font-bold hover:text-indigo-600 transition-all">
        <Globe className="w-5 h-5" />
        <span className="uppercase text-xs">{lang}</span>
      </button>

      {/* Menu déroulant */}
      <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col overflow-hidden">
        <button onClick={() => setLang("fr")} className={`px-4 py-2 text-sm font-bold text-left hover:bg-slate-50 ${lang === 'fr' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}>🇫🇷 Français</button>
        <button onClick={() => setLang("en")} className={`px-4 py-2 text-sm font-bold text-left hover:bg-slate-50 ${lang === 'en' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}>🇬🇧 English</button>
        <button onClick={() => setLang("ar")} className={`px-4 py-2 text-sm font-bold text-right hover:bg-slate-50 ${lang === 'ar' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600'}`}>🇩🇿 العربية</button>
      </div>
    </div>
  );
}