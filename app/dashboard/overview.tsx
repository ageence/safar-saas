"use client";
import { useState, useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, TrendingUp, BarChart3, LineChart } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function Overview({ data }: { data: { date: string, amount: number }[] }) {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year" | "custom">("year");
  
  const [chartType, setChartType] = useState<"area" | "bar">("area"); 
  
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  const chartData = useMemo(() => {
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl">
          <p className="text-sm font-bold text-slate-500 mb-1">{label}</p>
          <p className="text-lg font-black text-cyan-600">
            {new Intl.NumberFormat("fr-DZ").format(payload[0].value)} DA
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Activity className="h-6 w-6 text-cyan-500"/> {t("financialFlow")}
          </h3>
          <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500"/> 
            {new Intl.NumberFormat("fr-DZ").format(totalPeriod)} {t("generatedRevenue")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
            <button onClick={() => setChartType("area")} className={`p-2 rounded-lg transition-all ${chartType === 'area' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`} title="Courbe">
              <LineChart className="w-4 h-4"/>
            </button>
            <button onClick={() => setChartType("bar")} className={`p-2 rounded-lg transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-400 hover:text-slate-600'}`} title="Barres">
              <BarChart3 className="w-4 h-4"/>
            </button>
          </div>

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
          <ResponsiveContainer height="100%" width="100%">
            {chartType === "bar" ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} width={60} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value} width={60} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}