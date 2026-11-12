"use client";

import { Users, FileText, Wallet, PlaneTakeoff, TrendingUp, Activity, MapPin, Sparkles, Star, BrainCircuit } from "lucide-react";
import { Overview } from "./overview";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export default function DashboardClient({ session, clientsCount, visasCount, bookingsCount, totalRevenue, rawChartData, recentBookings }: any) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-1000 w-full pb-12">
      
      {/* HERO SECTION VIP */}
      <div className="glass-promax w-full p-10 md:p-14 flex flex-col md:flex-row justify-between items-center gap-10 bg-gradient-to-r from-white/60 to-cyan-50/40">
        <div className="relative z-10 w-full md:w-2/3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-6 text-orange-500 font-bold uppercase tracking-widest text-xs">
            <Sparkles className="h-4 w-4" /> {t("prestigeEdition")}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 mb-4 leading-tight">
            {t("excellence")} <br/><span className="text-royal-ocean">{t("travel")}</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl">
            {t("welcomeDesc")}, <span className="font-bold text-slate-800">{session.user.name}</span>. {t("welcomeDesc2")}
          </p>
        </div>
        
        <div className="w-full md:w-1/3 flex justify-end">
          <div className="p-8 bg-white/80 rounded-[2rem] border border-white shadow-xl shadow-cyan-500/10 text-center w-full max-w-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-[40px] group-hover:bg-orange-400/20 transition-colors duration-700"></div>
            <Star className="h-10 w-10 text-orange-400 mx-auto mb-4 animate-float" />
            <h3 className="text-2xl font-extrabold text-slate-800">{t("certified")}</h3>
            <p className="text-slate-500 font-medium mt-2">{t("cloudActive")}</p>
          </div>
        </div>
      </div>

      {/* BENTO GRID 12 COLONNES */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        
        <div className="glass-promax col-span-1 md:col-span-6 lg:col-span-6 p-8 md:p-10 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                {t("treasury")} <TrendingUp className="h-4 w-4 text-emerald-500" />
              </p>
              <h2 className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">
                {new Intl.NumberFormat("fr-DZ").format(totalRevenue)} <span className="text-3xl text-royal-ocean">DA</span>
              </h2>
            </div>
            <div className="p-5 bg-white rounded-3xl shadow-lg shadow-blue-500/10 border border-blue-50 group-hover:scale-110 transition-transform duration-500 hidden sm:block">
              <Wallet className="h-8 w-8 text-blue-500 animate-float" />
            </div>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 w-[85%] rounded-full"></div>
          </div>
        </div>

        <div className="glass-promax col-span-1 md:col-span-3 lg:col-span-2 p-8 flex flex-col items-center justify-center text-center group">
          <div className="p-4 bg-emerald-50 rounded-2xl mb-4 group-hover:bg-emerald-100 transition-colors">
            <Users className="h-8 w-8 text-emerald-500 animate-float" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1">{clientsCount}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("clients")}</p>
        </div>

        <div className="glass-promax col-span-1 md:col-span-3 lg:col-span-2 p-8 flex flex-col items-center justify-center text-center group">
          <div className="p-4 bg-purple-50 rounded-2xl mb-4 group-hover:bg-purple-100 transition-colors">
            <FileText className="h-8 w-8 text-purple-500 animate-float" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1">{visasCount}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("visas")}</p>
        </div>

        <div className="glass-promax col-span-1 md:col-span-6 lg:col-span-2 p-8 flex flex-col items-center justify-center text-center group bg-gradient-to-b from-transparent to-orange-50/30">
          <div className="p-4 bg-orange-50 rounded-2xl mb-4 group-hover:bg-orange-100 transition-colors">
            <PlaneTakeoff className="h-8 w-8 text-orange-500 animate-float" />
          </div>
          <h3 className="text-4xl font-black text-slate-900 mb-1">{bookingsCount}</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t("departures")}</p>
        </div>

        {/* GRAPHIQUE INTELLIGENT */}
        <div className="glass-promax col-span-1 md:col-span-8 p-8 flex flex-col justify-between">
          <Overview data={rawChartData} />
        </div>

        {/* LIVE FEED */}
        <div className="glass-promax col-span-1 md:col-span-4 p-8 flex flex-col bg-white/40">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-5">
            <h3 className="text-2xl font-black text-slate-800">{t("liveFeed")}</h3>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          </div>
          
          <div className="space-y-4 flex-1">
            {recentBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-50">
                <MapPin className="h-10 w-10 mb-2" />
                <p className="text-sm font-bold">{t("noDepartures")}</p>
              </div>
            ) : (
              recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white shadow-sm border border-slate-100 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlaneTakeoff className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[16px] font-extrabold text-slate-900 truncate">{booking.client.lastName} {booking.client.firstName}</p>
                    <p className="text-xs font-bold text-slate-500 truncate mt-0.5">{booking.offer.title}</p>
                  </div>
                  <div className="text-right pr-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                      {t("new")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* SAFAR AI */}
        <div className="col-span-1 md:col-span-12 p-8 md:p-10 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2.5rem] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl mt-2 border border-indigo-500/20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-inner flex-shrink-0">
              <Sparkles className="h-10 w-10 text-indigo-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">{t("discoverAI")} </h3>
              <p className="text-indigo-100/80 font-medium text-lg max-w-2xl leading-relaxed">
                {t("aiDesc")}
              </p>
            </div>
          </div>
          <div className="relative z-10 w-full lg:w-auto flex-shrink-0">
            <Link href="/dashboard/ai">
              <button className="w-full lg:w-auto bg-white hover:bg-indigo-50 text-indigo-700 font-black px-8 py-4 rounded-2xl shadow-[0_10px_40px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_60px_rgba(255,255,255,0.4)] hover:-translate-y-1 transition-all text-lg flex items-center justify-center gap-3">
                <BrainCircuit className="w-6 h-6" /> {t("consultAssistant")}
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}