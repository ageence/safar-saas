export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Activity, CalendarDays } from "lucide-react";
import Link from "next/link";

export default async function FinancesPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const session = await auth();
  if (!session?.user?.agencyId) return null;
  const sParams = await searchParams;
  const period = sParams.period || "month";

  // Configuration des filtres de dates
  const now = new Date();
  let startDate = new Date(0); // All time par défaut
  
  if (period === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === "year") {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  // Requêtes filtrées
  const bookings = await prisma.booking.findMany({
    where: { agencyId: session.user.agencyId, createdAt: { gte: startDate } },
    include: { offer: true, client: true },
    orderBy: { createdAt: "desc" }
  });

  const visas = await prisma.visaApplication.findMany({
    where: { agencyId: session.user.agencyId, createdAt: { gte: startDate } },
    include: { client: true },
    orderBy: { createdAt: "desc" }
  });

  // Calculs Financiers
  let caTotal = 0;
  let caEnAttente = 0;

  const transactions = [];

  bookings.forEach(b => {
    const price = b.offer?.price || 0;
    if (b.status === "CONFIRME" || b.status === "PAYE") caTotal += price;
    else caEnAttente += price;
    
    transactions.push({ id: b.id, type: "Voyage", client: `${b.client.firstName} ${b.client.lastName}`, amount: price, status: b.status, date: b.createdAt });
  });

  visas.forEach(v => {
    const price = v.price || 0;
    if (v.status === "APPROUVE" || v.status === "PAYE") caTotal += price;
    else caEnAttente += price;
    
    transactions.push({ id: v.id, type: "Visa", client: `${v.client.firstName} ${v.client.lastName}`, amount: price, status: v.status, date: v.createdAt });
  });

  // Trier les transactions par date
  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3"><Wallet className="w-10 h-10 text-rose-500" /> Flux Financier</h1>
          <p className="text-slate-500 font-medium mt-1">Supervisez la trésorerie et les encaissements de l'agence.</p>
        </div>
        
        {/* 🟢 LES FILTRES PROFESSIONNELS */}
        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1">
          <FilterButton current={period} value="today" label="Aujourd'hui" />
          <FilterButton current={period} value="month" label="Ce Mois" />
          <FilterButton current={period} value="year" label="Cette Année" />
          <FilterButton current={period} value="all" label="Tout" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <p className="text-sm font-extrabold text-slate-500 uppercase flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-emerald-500" /> CA Réalisé</p>
          <h2 className="text-4xl font-black text-slate-900">{new Intl.NumberFormat('fr-DZ').format(caTotal)} <span className="text-xl text-slate-400">DA</span></h2>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all"></div>
          <p className="text-sm font-extrabold text-slate-500 uppercase flex items-center gap-2 mb-2"><CalendarDays className="w-4 h-4 text-orange-500" /> En Attente de Paiement</p>
          <h2 className="text-4xl font-black text-slate-900">{new Intl.NumberFormat('fr-DZ').format(caEnAttente)} <span className="text-xl text-slate-400">DA</span></h2>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
          <p className="text-sm font-extrabold text-slate-400 uppercase flex items-center gap-2 mb-2 relative z-10"><CreditCard className="w-4 h-4 text-indigo-400" /> Total Global Estimé</p>
          <h2 className="text-4xl font-black text-white relative z-10">{new Intl.NumberFormat('fr-DZ').format(caTotal + caEnAttente)} <span className="text-xl text-slate-500">DA</span></h2>
        </div>
      </div>

      {/* Table des transactions */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
        <h3 className="text-xl font-black text-slate-800 mb-6">Détail des Transactions ({period === 'today' ? "Aujourd'hui" : period === 'month' ? "Ce mois" : period === 'year' ? "Cette année" : "Tout l'historique"})</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-bold">Aucune transaction pour cette période.</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((t, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`p-3 rounded-xl ${t.type === 'Visa' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                    {t.type === 'Visa' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{t.client}</h4>
                    <p className="text-xs font-bold text-slate-400">{t.type} • {t.date.toLocaleDateString('fr-FR')} à {t.date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-3 py-1 rounded-full text-xs font-black ${t.status === 'EN_ATTENTE' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'}`}>
                    {t.status}
                  </span>
                  <span className="font-black text-lg text-slate-900">{new Intl.NumberFormat('fr-DZ').format(t.amount)} DA</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterButton({ current, value, label }: { current: string, value: string, label: string }) {
  const isActive = current === value;
  return (
    <Link href={`/dashboard/finances?period=${value}`}>
      <button className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-rose-50 text-rose-600 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
        {label}
      </button>
    </Link>
  );
}