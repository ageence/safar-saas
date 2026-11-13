"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Settings, Users, MessageSquare, Globe, CheckCircle2, Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updateAgency, addEmployee } from "./actions";
import { useLanguage } from "@/components/language-provider";
import { Language } from "@/lib/i18n/dictionaries";
import { Badge } from "@/components/ui/badge";

export default function SettingsClient({ agency, team, isAdmin }: any) {
  const { lang, setLang, t } = useLanguage();
  const isAr = lang === 'ar';
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "ar", name: "العربية", flag: "🇩🇿" }
  ];

  if (!mounted) return null;

  return (
    <div className={`space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-12 w-full max-w-5xl mx-auto ${isAr ? 'text-right' : 'text-left'}`}>
      
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t("settingsTitle")}</h1>
        <p className="text-slate-500 dark:text-slate-300 font-medium mt-2">{t("settingsDesc")}</p>
      </div>

      <Tabs defaultValue="apparence" className="w-full" dir={isAr ? "rtl" : "ltr"}>
        
        <div className="w-full overflow-hidden mb-8">
          <TabsList className="flex w-full overflow-x-auto no-scrollbar bg-slate-100/50 dark:bg-slate-900 p-2 rounded-3xl gap-2 h-auto justify-start border border-slate-200/50 dark:border-slate-800">
            <TabsTrigger value="general" className="whitespace-nowrap rounded-2xl px-6 py-3 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:text-cyan-600 dark:data-[state=active]:text-cyan-400 transition-all text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white">
              {t("tabGeneral")}
            </TabsTrigger>
            <TabsTrigger value="apparence" className="whitespace-nowrap rounded-2xl px-6 py-3 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:text-indigo-600 dark:data-[state=active]:text-indigo-400 transition-all text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white">
              {t("appearance")}
            </TabsTrigger>
            <TabsTrigger value="langue" className="whitespace-nowrap rounded-2xl px-6 py-3 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 transition-all text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white">
              {t("tabLang")}
            </TabsTrigger>
            <TabsTrigger value="equipe" className="whitespace-nowrap rounded-2xl px-6 py-3 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400 transition-all text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white">
              {t("tabTeam")}
            </TabsTrigger>
            <TabsTrigger value="automatisations" className="whitespace-nowrap rounded-2xl px-6 py-3 font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-md data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 transition-all text-slate-500 dark:text-slate-300 hover:text-slate-700 dark:hover:text-white">
              {t("tabAuto")}
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* GÉNÉRAL */}
        <TabsContent value="general" className="mt-0">
          <div className="glass-promax dark:bg-slate-900 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] transition-colors">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-2xl border border-transparent dark:border-cyan-500/20"><Settings className="w-7 h-7" /></div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t("agencyProfile")}</h2>
                <p className="text-slate-500 dark:text-slate-300 font-medium text-sm mt-1">{t("agencyDesc")}</p>
              </div>
            </div>
            
            <form action={updateAgency} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">{t("agencyName")}</label>
                  <input name="name" defaultValue={agency?.name} className="w-full" />
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">{t("phoneMain")}</label>
                  <input name="phone" defaultValue={agency?.phone || ""} dir="ltr" className={`w-full ${isAr ? 'text-right' : 'text-left'}`} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest">{t("address")}</label>
                <input name="address" defaultValue={agency?.address || ""} className="w-full" />
              </div>
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-8">
                <Button type="submit" className="bg-slate-900 dark:bg-cyan-600 hover:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold rounded-2xl px-8 h-14 shadow-lg transition-all text-lg">
                  {t("update")}
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* APPARENCE */}
        <TabsContent value="apparence" className="mt-0">
          <div className="glass-promax dark:bg-slate-900 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] transition-colors">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-transparent dark:border-indigo-500/20"><Monitor className="w-7 h-7" /></div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t("appearance")}</h2>
                <p className="text-slate-500 dark:text-slate-300 font-medium text-sm mt-1">{t("themeDesc")}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button onClick={() => setTheme("light")} className={`p-1 rounded-[2rem] border-4 transition-all text-left ${theme === "light" ? "border-indigo-500 shadow-xl shadow-indigo-500/20" : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"}`}>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[1.7rem] p-6 h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden transition-colors border border-transparent dark:border-slate-700">
                  {theme === "light" && <div className="absolute top-4 right-4 bg-indigo-500 text-white p-1 rounded-full"><CheckCircle2 className="w-5 h-5" /></div>}
                  <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-md dark:shadow-none flex items-center justify-center border border-slate-100 dark:border-slate-600"><Sun className="w-10 h-10 text-amber-500" /></div>
                  <span className="font-black text-xl text-slate-800 dark:text-white">{t("lightMode")}</span>
                </div>
              </button>
              <button onClick={() => setTheme("dark")} className={`p-1 rounded-[2rem] border-4 transition-all text-left ${theme === "dark" ? "border-indigo-500 shadow-xl shadow-indigo-500/20" : "border-transparent hover:border-slate-200 dark:hover:border-slate-700"}`}>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-[1.7rem] p-6 h-full flex flex-col items-center justify-center gap-4 relative overflow-hidden transition-colors border border-slate-800 dark:border-slate-800">
                  {theme === "dark" && <div className="absolute top-4 right-4 bg-indigo-500 text-white p-1 rounded-full"><CheckCircle2 className="w-5 h-5" /></div>}
                  <div className="w-20 h-20 rounded-full bg-slate-800 dark:bg-slate-900 shadow-inner flex items-center justify-center border border-slate-700 dark:border-slate-800"><Moon className="w-10 h-10 text-indigo-400" /></div>
                  <span className="font-black text-xl text-white">{t("darkMode")}</span>
                </div>
              </button>
            </div>
          </div>
        </TabsContent>

        {/* LANGUES */}
        <TabsContent value="langue" className="mt-0">
          <div className="glass-promax dark:bg-slate-900 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] transition-colors">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-transparent dark:border-emerald-500/20"><Globe className="w-7 h-7" /></div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t("languageTitle")}</h2>
                <p className="text-slate-500 dark:text-slate-300 font-medium text-sm mt-1">{t("languageDesc")}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {languages.map((l) => {
                const isActive = lang === l.code;
                return (
                  <button 
                    key={l.code}
                    onClick={() => setLang(l.code as Language)}
                    className={`relative p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center text-center gap-4 active:scale-95 ${
                      isActive ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10" : "border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-emerald-200 dark:hover:border-slate-600"
                    }`}
                  >
                    {isActive && <div className={`absolute top-4 ${isAr ? 'left-4' : 'right-4'} bg-emerald-500 text-white p-1 rounded-full shadow-md`}><CheckCircle2 className="w-5 h-5" /></div>}
                    <span className="text-5xl">{l.flag}</span>
                    <h3 className={`font-black text-2xl ${isActive ? "text-emerald-900 dark:text-emerald-400" : "text-slate-800 dark:text-white"}`}>{l.name}</h3>
                  </button>
                );
              })}
            </div>
          </div>
        </TabsContent>

        {/* ÉQUIPE */}
        <TabsContent value="equipe" className="mt-0 space-y-6">
          <div className="glass-promax dark:bg-slate-900 dark:border-slate-800 p-8 md:p-10 rounded-[2.5rem] transition-colors">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-2xl border border-transparent dark:border-orange-500/20"><Users className="w-7 h-7" /></div>
              <div><h2 className="text-2xl font-black text-slate-800 dark:text-white">{t("teamMembers")}</h2></div>
            </div>
            
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-300 text-xs uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'}`}>
                    <th className="p-4 font-bold">{t("colName")}</th>
                    <th className="p-4 font-bold">{t("colEmail")}</th>
                    <th className="p-4 font-bold">{t("colRole")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {team.map((member: any) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className={`p-4 font-extrabold text-slate-800 dark:text-white ${isAr ? 'text-right' : 'text-left'}`}>{member.name}</td>
                      <td className={`p-4 font-medium text-slate-500 dark:text-slate-300 ${isAr ? 'text-right' : 'text-left'}`} dir="ltr">{member.email}</td>
                      <td className={`p-4 ${isAr ? 'text-right' : 'text-left'}`}>
                        <Badge className={`${member.role === "AGENCY_ADMIN" ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"} border-none px-3 py-1 font-bold`}>
                          {member.role === "AGENCY_ADMIN" ? t("roleAdmin") : t("roleEmp")}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}