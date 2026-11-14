"use client";

import { Users, FileText, Wallet, PlaneTakeoff, TrendingUp, Activity, MapPin, Sparkles, BrainCircuit, PlusCircle } from "lucide-react";
import { Overview } from "./overview";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export default function DashboardClient({ session, clientsCount, visasCount, bookingsCount, totalRevenue, rawChartData, recentBookings }: any) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000 w-full pb-12">
      
      {/* 🚀 HERO SECTION VIP (RTL NATIF + DARK MODE) */}
      <div 
        dir={isAr ? "rtl" : "ltr"}
        className="glass-promax w-full p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-10 bg-gradient-to-r from-white/60 to-cyan-50/40 dark:from-slate-900/80 dark:to-cyan-950/30 transition-colors"
      >
        <div className="relative z-10 w-full md:w-1/2 text-center md:text-start">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-4 leading-tight transition-colors">
            {t("welcome")}, <span className="text-royal-ocean dark:text-cyan-400">{session.user.name}</span>.
          </h1>
          <p className="text-slate-500 dark:text-slate-300 text-lg font-medium max-w-xl transition-colors">
            {t("welcomeDesc")}. {t("welcomeDesc2")}
          </p>
        </div>
        
        {/* 🚀 QUICK ACTIONS (Nouveau Design Dark Mode sans gris) */}
        <div className="w-full md:w-1/2 flex flex-col md:flex-row gap-4 md:justify-end">
          <Link href="/dashboard/clients" className="flex-1 max-w-[200px] mx-auto md:mx-0">
            <button className="w-full p-4 bg-white/80 dark:bg-[#0a1120] hover:bg-white dark:hover:bg-[#13213c] rounded-2xl border border-slate-100 dark:border-[#172542] dark:hover:border-[#1e335b] shadow-sm hover:shadow-lg dark:hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] transition-all group flex flex-col items-center justify-center gap-2">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform"><PlusCircle className="w-6 h-6" /></div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors">{t("quickActionNewClient")}</span>
            </button>
          </Link>

          <Link href="/dashboard/visas" className="flex-1 max-w-[200px] mx-auto md:mx-0">
            <button className="w-full p-4 bg-white/80 dark:bg-[#0a1120] hover:bg-white dark:hover:bg-[#13213c] rounded-2xl border border-slate-100 dark:border-[#172542] dark:hover:border-[#1e335b] shadow-sm hover:shadow-lg dark:hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] transition-all group flex flex-col items-center justify-center gap-2">
              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-500 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform"><PlusCircle className="w-6 h-6" /></div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors">{t("quickActionNewVisa")}</span>
            </button>
          </Link>

          <Link href="/dashboard/offres" className="flex-1 max-w-[200px] mx-auto md:mx-0">
            <button className="w-full p-4 bg-white/80 dark:bg-[#0a1120] hover:bg-white dark:hover:bg-[#13213c] rounded-2xl border border-slate-100 dark:border-[#172542] dark:hover:border-[#1e335b] shadow-sm hover:shadow-lg dark:hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.5)] transition-all group flex flex-col items-center justify-center gap-2">
              <div className="p-3 bg-orange-50 dark:bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded-xl group-hover:scale-110 transition-transform"><PlusCircle className="w-6 h-6" /></div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors">{t("quickActionNewTrip")}</span>
            </button>
          </Link>
        </div>
      </div>

      {/* BENTO GRID 12 COLONNES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        
        {/* TRÉSORERIE */}
        <div className="glass-promax col-span-1 md:col-span-6 lg:col-span-6 p-8 md:p-10 flex flex-col justify-between group transition-colors">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                {t("treasury")} <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              </p>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter transition-colors" dir="ltr">
                {new Intl.NumberFormat("fr-DZ").format(totalRevenue)} <span className="text-3xl text-royal-ocean dark:text-cyan-400">DA</span>
              </h2>
            </div>
            <div className="p-5 bg-white dark:bg-[#0a1120] rounded-3xl shadow-lg shadow-blue-500/10 border border-blue-50 dark:border-blue-900/30 group-hover:scale-110 transition-transform duration-500 hidden sm:block">
              <Wallet className="h-8 w-8 text-blue-500 dark:text-blue-400 animate-float" />
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors" dir="ltr">
            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 w-[85%] rounded-full"></div>
          </div>
        </div>

        {/* CLIENTS */}
        <div className="glass-promax col-span-1 md:col-span-3 lg:col-span-2 p-8 flex flex-col items-center justify-center text-center group transition-colors">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
            <Users className="h-8 w-8 text-emerald-500 dark:text-emerald-400 animate-float" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 transition-colors">{clientsCount}</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider transition-colors">{t("clients")}</p>
        </div>

        {/* VISAS */}
        <div className="glass-promax col-span-1 md:col-span-3 lg:col-span-2 p-8 flex flex-col items-center justify-center text-center group transition-colors">
          <div className="p-4 bg-purple-50 dark:bg-purple-500/10 rounded-2xl mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-colors">
            <FileText className="h-8 w-8 text-purple-500 dark:text-purple-400 animate-float" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 transition-colors">{visasCount}</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider transition-colors">{t("visas")}</p>
        </div>

        {/* VOYAGES */}
        <div className="glass-promax col-span-1 md:col-span-6 lg:col-span-2 p-8 flex flex-col items-center justify-center text-center group bg-gradient-to-b from-transparent to-orange-50/30 dark:to-orange-900/10 transition-colors">
          <div className="p-4 bg-orange-50 dark:bg-orange-500/10 rounded-2xl mb-4 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/20 transition-colors">
            <PlaneTakeoff className="h-8 w-8 text-orange-500 dark:text-orange-400 animate-float" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-1 transition-colors">{bookingsCount}</h3>
          <p className="text-xs font-bold text-slate-400 dark:text-slate-300 uppercase tracking-wider transition-colors">{t("departures")}</p>
        </div>

        {/* GRAPHIQUE INTELLIGENT */}
        <div className="glass-promax col-span-1 md:col-span-8 p-8 flex flex-col justify-between transition-colors">
          <Overview data={rawChartData} />
        </div>

        {/* LIVE FEED (Entièrement corrigé en Dark Mode) */}
        <div className="glass-promax col-span-1 md:col-span-4 p-8 flex flex-col bg-white/40 dark:bg-slate-900/40 transition-colors" dir={isAr ? "rtl" : "ltr"}>
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-5 transition-colors">
            <h3 className="text-2xl font-black text-slate-800 dark:text-white transition-colors">{t("liveFeed")}</h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 opacity-50">
                <MapPin className="h-10 w-10 mb-2" />
                <p className="text-sm font-bold">{t("noDepartures")}</p>
              </div>
            ) : (
              recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white dark:bg-[#0a1120] shadow-sm border border-slate-100 dark:border-[#172542] hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-50 dark:from-cyan-900/20 to-blue-50 dark:to-blue-900/20 flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                    <PlaneTakeoff className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[16px] font-extrabold text-slate-900 dark:text-white truncate transition-colors">{booking.client.lastName} {booking.client.firstName}</p>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate mt-0.5 transition-colors">{booking.offer.title}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors">
                      {t("new")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🚀 SAFAR AI BANNER (Aucun changement, elle était déjà dark nativement !) */}
        <div 
          dir={isAr ? "rtl" : "ltr"}
          className="col-span-1 md:col-span-12 p-8 md:p-10 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl mt-2 border border-indigo-500/20"
        >
          <div className={`absolute top-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none ${isAr ? 'left-0' : 'right-0'}`}></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-start w-full lg:w-auto">
            <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner flex-shrink-0">
              <Sparkles className="h-10 w-10 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{t("discoverAI")}</h3>
              <p className="text-indigo-100/80 font-medium text-lg max-w-2xl leading-relaxed">
                {t("aiDesc")}
              </p>
            </div>
          </div>
          
          <div className="relative z-10 w-full lg:w-auto flex-shrink-0">
            <Link href="/dashboard/ai">
              <button className="w-full lg:w-auto bg-white dark:bg-[#0a1120] hover:bg-indigo-50 dark:hover:bg-[#13213c] text-indigo-700 dark:text-indigo-400 font-black px-8 py-4 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.2)] dark:shadow-none hover:-translate-y-1 transition-all border border-transparent dark:border-indigo-900/50 text-lg flex items-center justify-center gap-3">
                <BrainCircuit className="w-6 h-6" /> 
                <span>{t("consultAssistant")}</span>
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}