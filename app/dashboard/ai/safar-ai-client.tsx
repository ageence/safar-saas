"use client";

import { useLanguage } from "@/components/language-provider";
import { Sparkles, BrainCircuit, BarChart3 } from "lucide-react";

// Le badge local que tu as créé
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`px-2.5 py-0.5 rounded-full font-bold ${className}`}>{children}</span>;
}

export function SafarAIClient({ insights, offers }: { insights: any[], offers: any[] }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      <div className="glass-promax p-10 rounded-[2.5rem] relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl shadow-lg text-indigo-300">
              <Sparkles className="h-10 w-10 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                {t("safarAI")} <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1">{t("aiCopilot")}</Badge>
              </h1>
              <p className="text-slate-400 font-medium mt-2 max-w-lg">{t("aiAnalysis")}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-600" /> {t("stratRecs")}
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex items-start gap-5">
                <div className={`p-4 rounded-2xl ${insight.bg} ${insight.color} shadow-inner`}>
                  <insight.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 mb-1">{t(insight.titleKey)}</h3>
                  
                  {/* On reconstruit le message traduit avec des variables */}
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {insight.type === "SUCCESS" && `${t("offer")} "${insight.dataTitle}" ${t("trendMsg")}`}
                    {insight.type === "WARNING" && `${t("depletionMsg1")} ${insight.dataSeats} ${t("depletionMsg2")} "${insight.dataTitle}". ${t("depletionMsg3")}`}
                    {insight.type === "ALERT" && `${t("offer")} "${insight.dataTitle}" ${t("underperfMsg")}`}
                    {insight.type === "ACTION" && `${t("visaMsg1")} ${insight.dataCount} ${t("visaMsg2")}`}
                    {insight.type === "INFO" && t("learningMsg")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-slate-800" /> {t("salesSpeed")}
          </h2>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            {offers.slice(0, 3).map(offer => {
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
                  <p className="text-xs font-bold text-slate-400 text-right">
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