"use client";
import { useState, useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, TrendingUp, BarChart3 } from "lucide-react";
import { useLanguage } from "@/components/language-provider"; // 🟢 AJOUT

export function Overview({ data }: { data: { date: string, amount: number }[] }) {
  const { t } = useLanguage(); // 🟢 MOTEUR DE LANGUE
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year" | "custom">("year");
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const chartData = useMemo(() => {
    // ... Garde exactement la même logique de calcul que tu avais avant ...
    // (Pour ne pas alourdir le message, tu gardes le `useMemo` précédent intact,
    // il fonctionne avec les dates du système (JavaScript Dates)).
    const now = new Date();
    const result = [];
    if (timeframe === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const label = d.toLocaleDateString("fr-FR", { weekday: 'short', day: '2-digit' });
        const dayData = data.filter(x => new Date(x.date).toDateString() === d.toDateString());
        result.push({ name: label, total: dayData.reduce((sum, item) => sum + item.amount, 0) });
      }
    } else if (timeframe === "month") {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(now.getFullYear(), now.getMonth(), i);
        const dayData = data.filter(x => new Date(x.date).toDateString() === d.toDateString());
        result.push({ name: `${i}`, total: dayData.reduce((sum, item) => sum + item.amount, 0) });
      }
    } else if (timeframe === "year") {
      const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
      for (let i = 0; i < 12; i++) {
        const monthData = data.filter(x => new Date(x.date).getMonth() === i && new Date(x.date).getFullYear() === now.getFullYear());
        result.push({ name: moisNoms[i], total: monthData.reduce((sum, item) => sum + item.amount, 0) });
      }
    } else if (timeframe === "custom") {
      if (!customStart || !customEnd) return [];
      const start = new Date(customStart); const end = new Date(customEnd); end.setHours(23, 59, 59, 999);
      if (start > end) return [];
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 31) {
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dayData = data.filter(x => new Date(x.date).toDateString() === d.toDateString());
          result.push({ name: d.toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' }), total: dayData.reduce((sum, item) => sum + item.amount, 0) });
        }
      } else {
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        while(current <= end) {
          const monthData = data.filter(x => { const d = new Date(x.date); return d.getMonth() === current.getMonth() && d.getFullYear() === current.getFullYear() && d >= start && d <= end; });
          result.push({ name: current.toLocaleDateString("fr-FR", { month: 'short', year: '2-digit' }), total: monthData.reduce((sum, item) => sum + item.amount, 0) });
          current.setMonth(current.getMonth() + 1);
        }
      }
    }
    return result;
  }, [data, timeframe, customStart, customEnd]);

  const totalPeriod = chartData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="h-6 w-6 text-cyan-500" /> {t("financialFlow")}
          </h3>
          <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> 
            {new Intl.NumberFormat("fr-DZ").format(totalPeriod)} {t("generatedRevenue")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {timeframe === "custom" && (
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="bg-white text-xs font-bold text-slate-700 rounded-lg px-2 py-1.5 outline-none border border-slate-200" />
              <span className="text-[10px] font-black text-slate-400 uppercase">{t("to")}</span>
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="bg-white text-xs font-bold text-slate-700 rounded-lg px-2 py-1.5 outline-none border border-slate-200" />
            </div>
          )}

          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button onClick={() => setTimeframe("week")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'week' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>{t("days7")}</button>
            <button onClick={() => setTimeframe("month")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'month' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>{t("thisMonth")}</button>
            <button onClick={() => setTimeframe("year")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'year' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>{t("thisYear")}</button>
            <button onClick={() => setTimeframe("custom")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'custom' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>{t("custom")}</button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-2xl">
            {t("noData")}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} width={40} />
                <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}