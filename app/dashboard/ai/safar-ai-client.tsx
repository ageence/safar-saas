"use client";

import { useLanguage } from "@/components/language-provider";
import { Sparkles, BrainCircuit, BarChart3, TrendingUp, Clock, AlertTriangle, Zap, CreditCard, Users, CheckCircle, PieChart } from "lucide-react";

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`px-2.5 py-0.5 rounded-full font-bold shadow-sm ${className}`}>{children}</span>;
}

const getIcon = (type: string) => {
  switch(type) {
    case "SUCCESS": return <TrendingUp className="w-8 h-8" />;
    case "WARNING": return <Clock className="w-8 h-8" />;
    case "ALERT": return <AlertTriangle className="w-8 h-8" />;
    case "ACTION": return <Zap className="w-8 h-8" />;
    case "DEBT": return <CreditCard className="w-8 h-8" />;
    case "VIP": return <Users className="w-8 h-8" />;
    case "INFO": default: return <BrainCircuit className="w-8 h-8" />;
  }
};

export function SafarAIClient({ insights, offers, metrics }: { insights: any[], offers: any[], metrics: any }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* 🚀 HEADER PREMIUM "WOW" (Dark Mode Forcé pour faire ressortir le texte) */}
      <div className="relative p-10 md:p-12 rounded-[2.5rem] overflow-hidden bg-slate-950 border border-slate-800 shadow-[0_20px_50px_rgba(79,70,229,0.15)] group">
        
        {/* Lumières IA (Néon Blur) */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600 rounded-full blur-[100px] opacity-50 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-cyan-600 rounded-full blur-[100px] opacity-40"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            
            {/* Boîte Icone avec effet flottant */}
            <div className="p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl shadow-lg shadow-indigo-500/40 text-white transform group-hover:scale-110 transition-transform duration-700">
              <Sparkles className="h-10 w-10 animate-pulse text-white" />
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight flex items-center gap-4 text-white">
                {/* Texte avec effet dégradé */}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-cyan-200">
                  {t("safarAI")} 
                </span>
                
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-indigo-600 to-cyan-600 border-none text-white text-xs py-1.5 px-4 uppercase tracking-widest shadow-lg shadow-indigo-500/40">
                    {t("aiCopilot")}
                  </Badge>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
              </h1>
              <p className="text-slate-300 font-medium mt-3 max-w-2xl leading-relaxed text-lg">
                {t("aiAnalysis")}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 🚀 BENTO BOXES KPI PRÉDICTIFS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><PieChart className="w-16 h-16 text-emerald-500"/></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t("totalExpectedRevenue")}</p>
          <h4 className="text-3xl font-black text-slate-800">{new Intl.NumberFormat("fr-DZ").format(metrics.totalExpected)} <span className="text-sm text-slate-500">DA</span></h4>
        </div>

        <div className="bg-white p-6 rounded-3xl border-l-4 border-rose-500 border-y border-r border-slate-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CreditCard className="w-16 h-16 text-rose-500"/></div>
          <p className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">{t("unpaidDebts")}</p>
          <h4 className="text-3xl font-black text-rose-600">{new Intl.NumberFormat("fr-DZ").format(metrics.unpaidDebt)} <span className="text-sm text-rose-400">DA</span></h4>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><CheckCircle className="w-16 h-16 text-indigo-500"/></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t("visaSuccessRate")}</p>
          <h4 className="text-3xl font-black text-slate-800">{metrics.visaSuccessRate}%</h4>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3"><div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${metrics.visaSuccessRate}%` }}></div></div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Users className="w-16 h-16 text-purple-500"/></div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t("vipClients")}</p>
          <h4 className="text-3xl font-black text-slate-800">{metrics.returningClients} <span className="text-sm font-medium text-slate-500">{t("clients")}</span></h4>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LE PLAN D'ACTION INTELLIGENT (INSIGHTS) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-600" /> {t("stratRecs")}
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex items-start gap-5">
                <div className={`p-4 rounded-2xl ${insight.bg} ${insight.color} shadow-inner`}>
                  {getIcon(insight.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-black text-slate-800 mb-1">{t(insight.titleKey)}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {insight.type === "SUCCESS" && `${t("offer")} "${insight.dataTitle}" ${t("trendMsg")}`}
                    {insight.type === "WARNING" && `${t("depletionMsg1")} ${insight.dataSeats} ${t("depletionMsg2")} "${insight.dataTitle}". ${t("depletionMsg3")}`}
                    {insight.type === "ALERT" && `${t("offer")} "${insight.dataTitle}" ${t("underperfMsg")}`}
                    {insight.type === "ACTION" && `${t("visaMsg1")} ${insight.dataCount} ${t("visaMsg2")}`}
                    {insight.type === "INFO" && t("learningMsg")}
                    
                    {insight.type === "DEBT" && <>{t("unpaidDebtsMsg")} <strong className="text-rose-600">{new Intl.NumberFormat("fr-DZ").format(insight.dataAmount)} DA</strong>.</>}
                    {insight.type === "VIP" && `${t("vipClientsMsg")} (${insight.dataCount} ${t("clients")}).`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VITESSE DE VENTE */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-slate-800" /> {t("salesSpeed")}
          </h2>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            {offers.slice(0, 5).map(offer => {
              const fillRate = offer.totalSpots ? Math.round(((offer.totalSpots - (offer.availableSeats||0)) / offer.totalSpots) * 100) : 0;
              return (
                <div key={offer.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-slate-700">
                    <span className="truncate pr-4">{offer.title}</span>
                    <span dir="ltr">{fillRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden" dir="ltr">
                    <div className={`h-full rounded-full ${fillRate > 80 ? 'bg-rose-500' : fillRate > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${fillRate}%` }}></div>
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 text-right uppercase tracking-wider">
                    {fillRate > 80 ? `⚠️ ${t("almostFull")}` : `🟢 ${t("seatsAvailable")}`}
                  </p>
                </div>
              );
            })}
            {offers.length === 0 && <p className="text-slate-400 text-sm font-bold text-center py-4">{t("noSalesData")}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}