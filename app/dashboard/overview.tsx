"use client";

import { useState, useMemo } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, TrendingUp, BarChart3 } from "lucide-react";

export function Overview({ data }: { data: { date: string, amount: number }[] }) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year" | "custom">("year");
  const [chartType, setChartType] = useState<"area" | "bar">("area");
  
  // 🟢 NOUVEAU : Les dates personnalisées
  const [customStart, setCustomStart] = useState<string>("");
  const [customEnd, setCustomEnd] = useState<string>("");

  // 🟢 LOGIQUE DE FILTRAGE INTELLIGENTE
  const chartData = useMemo(() => {
    const now = new Date();
    const result = [];

    if (timeframe === "week") {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const label = d.toLocaleDateString("fr-FR", { weekday: 'short', day: '2-digit' });
        const dayData = data.filter(x => new Date(x.date).toDateString() === d.toDateString());
        const total = dayData.reduce((sum, item) => sum + item.amount, 0);
        result.push({ name: label, total });
      }
    } else if (timeframe === "month") {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(now.getFullYear(), now.getMonth(), i);
        const dayData = data.filter(x => new Date(x.date).toDateString() === d.toDateString());
        const total = dayData.reduce((sum, item) => sum + item.amount, 0);
        result.push({ name: `${i}`, total });
      }
    } else if (timeframe === "year") {
      const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
      for (let i = 0; i < 12; i++) {
        const monthData = data.filter(x => new Date(x.date).getMonth() === i && new Date(x.date).getFullYear() === now.getFullYear());
        const total = monthData.reduce((sum, item) => sum + item.amount, 0);
        result.push({ name: moisNoms[i], total });
      }
    } else if (timeframe === "custom") {
      // 🟢 LA LOGIQUE DU FILTRE PERSONNALISÉ
      if (!customStart || !customEnd) return [];
      
      const start = new Date(customStart);
      const end = new Date(customEnd);
      end.setHours(23, 59, 59, 999);
      
      if (start > end) return [];

      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
      
      if (diffDays <= 31) {
        // Si c'est un mois ou moins, on affiche jour par jour
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const label = d.toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' });
          const dayData = data.filter(x => new Date(x.date).toDateString() === d.toDateString());
          const total = dayData.reduce((sum, item) => sum + item.amount, 0);
          result.push({ name: label, total });
        }
      } else {
        // Si c'est plus long qu'un mois, on groupe par mois pour que le graphique reste propre
        let current = new Date(start.getFullYear(), start.getMonth(), 1);
        while(current <= end) {
          const label = current.toLocaleDateString("fr-FR", { month: 'short', year: '2-digit' });
          const monthData = data.filter(x => {
            const d = new Date(x.date);
            return d.getMonth() === current.getMonth() && d.getFullYear() === current.getFullYear() && d >= start && d <= end;
          });
          const total = monthData.reduce((sum, item) => sum + item.amount, 0);
          result.push({ name: label, total });
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
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-2xl">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-1">{label}</p>
          <p className="text-white font-black text-xl">
            {new Intl.NumberFormat("fr-DZ").format(payload[0].value)} <span className="text-cyan-400 text-sm">DA</span>
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
            <Activity className="h-6 w-6 text-cyan-500" /> Flux Financier
          </h3>
          <p className="text-slate-500 font-bold text-sm mt-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" /> 
            {new Intl.NumberFormat("fr-DZ").format(totalPeriod)} DA générés sur cette période.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* 🟢 NOUVEAU : SÉLECTEUR DE DATES PERSONNALISÉES */}
          {timeframe === "custom" && (
            <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-inner animate-in fade-in zoom-in-95 duration-200">
              <input type="date" value={customStart} onChange={(e) => setCustomStart(e.target.value)} className="bg-white text-xs font-bold text-slate-700 rounded-lg px-2 py-1.5 outline-none border border-slate-200 focus:border-cyan-500 transition-all" />
              <span className="text-[10px] font-black text-slate-400 uppercase">À</span>
              <input type="date" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} className="bg-white text-xs font-bold text-slate-700 rounded-lg px-2 py-1.5 outline-none border border-slate-200 focus:border-cyan-500 transition-all" />
            </div>
          )}

          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 overflow-x-auto">
            <button onClick={() => setTimeframe("week")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'week' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>7 Jours</button>
            <button onClick={() => setTimeframe("month")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'month' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>Ce Mois</button>
            <button onClick={() => setTimeframe("year")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'year' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>Année</button>
            {/* 🟢 BOUTON PERSONNALISÉ */}
            <button onClick={() => setTimeframe("custom")} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${timeframe === 'custom' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}>Personnalisé</button>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200 hidden sm:flex">
            <button onClick={() => setChartType("area")} className={`p-1.5 rounded-lg transition-all ${chartType === 'area' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><TrendingUp className="w-4 h-4" /></button>
            <button onClick={() => setChartType("bar")} className={`p-1.5 rounded-lg transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><BarChart3 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[300px]">
        {chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full text-slate-400 font-bold border-2 border-dashed border-slate-100 rounded-2xl">
            {timeframe === "custom" && (!customStart || !customEnd) ? "Veuillez sélectionner une date de début et de fin." : "Aucune donnée financière pour cette période."}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} width={40} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Area type="monotone" dataKey="total" stroke="#06b6d4" strokeWidth={4} fillOpacity={1} fill="url(#colorTotal)" activeDot={{ r: 8, fill: "#06b6d4", stroke: "#fff", strokeWidth: 3 }} />
              </AreaChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} width={40} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="total" fill="#0ea5e9" radius={[6, 6, 0, 0]} maxBarSize={40} />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}