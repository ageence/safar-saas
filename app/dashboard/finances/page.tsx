export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Activity, CalendarDays, Filter, PieChart, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default async function FinancesPage({ searchParams }: { searchParams: Promise<{ dateDebut?: string, dateFin?: string }> }) {
  const session = await auth();
  if (!session?.user?.agencyId) return null;
  const sParams = await searchParams;
  
  // 🟢 LOGIQUE DE FILTRAGE PROFESSIONNELLE PAR DATES EXACTES
  let dateDebut = sParams.dateDebut ? new Date(sParams.dateDebut) : null;
  let dateFin = sParams.dateFin ? new Date(sParams.dateFin) : null;

  if (dateFin) {
    dateFin.setHours(23, 59, 59, 999); // Inclure toute la journée de fin
  }

  let dateFilter = {};
  if (dateDebut && dateFin) {
    dateFilter = { gte: dateDebut, lte: dateFin };
  } else if (dateDebut) {
    dateFilter = { gte: dateDebut };
  } else if (dateFin) {
    dateFilter = { lte: dateFin };
  }

  const bookingsWhere: any = { agencyId: session.user.agencyId };
  const visasWhere: any = { agencyId: session.user.agencyId };
  
  if (Object.keys(dateFilter).length > 0) {
    bookingsWhere.createdAt = dateFilter;
    visasWhere.createdAt = dateFilter;
  }

  // 🟢 REQUÊTES
  const bookings = await prisma.booking.findMany({
    where: bookingsWhere,
    include: { offer: true, client: true },
    orderBy: { createdAt: "desc" }
  });

  const visas = await prisma.visaApplication.findMany({
    where: visasWhere,
    include: { client: true },
    orderBy: { createdAt: "desc" }
  });

  // 🟢 CALCULS FINANCIERS AVANCÉS
  let caTotal = 0;
  let caEnAttente = 0;
  let caVoyage = 0;
  let caVisa = 0;

  const transactions: { id: string; type: string; client: string; amount: number; status: string; date: Date }[] = [];

  bookings.forEach(b => {
    const price = b.offer?.price || 0;
    if (b.status === "CONFIRME" || b.status === "PAYE") {
      caTotal += price; caVoyage += price;
    } else {
      caEnAttente += price;
    }
    transactions.push({ id: b.id, type: "Voyage", client: `${b.client.firstName} ${b.client.lastName}`, amount: price, status: b.status, date: b.createdAt });
  });

  visas.forEach(v => {
    const price = v.price || 0;
    if (v.status === "APPROUVE" || v.status === "PAYE") {
      caTotal += price; caVisa += price;
    } else {
      caEnAttente += price;
    }
    transactions.push({ id: v.id, type: "Visa", client: `${v.client.firstName} ${v.client.lastName}`, amount: price, status: v.status, date: v.createdAt });
  });

  transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

  // Calcul des pourcentages
  const totalReel = caTotal || 1; // Eviter la division par 0
  const pctVoyage = Math.round((caVoyage / totalReel) * 100);
  const pctVisa = Math.round((caVisa / totalReel) * 100);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* HEADER & FILTRES (LE MOTEUR DE RECHERCHE FINANCIER) */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3"><Wallet className="w-10 h-10 text-rose-500" /> Flux Financier</h1>
          <p className="text-slate-500 font-medium mt-1">Supervisez la trésorerie avec précision.</p>
        </div>
        
        {/* LE FORMULAIRE DE FILTRE PAR DATE EXACTE */}
        <form className="relative z-10 flex flex-wrap items-end gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Du (Début)</label>
            <input type="date" name="dateDebut" defaultValue={sParams.dateDebut || ""} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm outline-none focus:border-rose-500" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Au (Fin)</label>
            <input type="date" name="dateFin" defaultValue={sParams.dateFin || ""} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm outline-none focus:border-rose-500" />
          </div>
          <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtrer
          </button>
          {(sParams.dateDebut || sParams.dateFin) && (
            <Link href="/dashboard/finances">
              <button type="button" className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold p-2.5 rounded-xl transition-all">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </Link>
          )}
        </form>
      </div>

      {/* KPI CARDS (ANALYSE DÉTAILLÉE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CA GLOBAL */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
          <p className="text-sm font-extrabold text-slate-500 uppercase flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-emerald-500" /> Total Encaissé</p>
          <h2 className="text-4xl font-black text-slate-900">{new Intl.NumberFormat('fr-DZ').format(caTotal)} <span className="text-xl text-slate-400">DA</span></h2>
        </div>

        {/* RÉPARTITION (NOUVEAU) */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all flex flex-col justify-center">
          <p className="text-sm font-extrabold text-slate-500 uppercase flex items-center gap-2 mb-4"><PieChart className="w-4 h-4 text-blue-500" /> Répartition des gains</p>
          <div className="flex w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
            <div className="bg-orange-500 h-full" style={{ width: `${pctVoyage}%` }}></div>
            <div className="bg-purple-500 h-full" style={{ width: `${pctVisa}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-orange-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Voyages: {pctVoyage}%</span>
            <span className="text-purple-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Visas: {pctVisa}%</span>
          </div>
        </div>

        {/* DETTES / EN ATTENTE */}
        <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent"></div>
          <p className="text-sm font-extrabold text-slate-400 uppercase flex items-center gap-2 mb-2 relative z-10"><CalendarDays className="w-4 h-4 text-rose-400" /> Reste à recouvrer (Dettes)</p>
          <h2 className="text-4xl font-black text-white relative z-10">{new Intl.NumberFormat('fr-DZ').format(caEnAttente)} <span className="text-xl text-slate-500">DA</span></h2>
        </div>

      </div>

      {/* TABLE DES TRANSACTIONS */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">
            Détail des Transactions 
            {(sParams.dateDebut || sParams.dateFin) && <span className="text-rose-500 ml-2">(Période Filtrée)</span>}
          </h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Aucune transaction financière trouvée pour cette période.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((t, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100 hover:border-rose-100">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`p-3 rounded-xl ${t.type === 'Visa' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                    {t.type === 'Visa' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{t.client}</h4>
                    <p className="text-xs font-bold text-slate-400">{t.type} • {t.date.toLocaleDateString('fr-FR')} à {t.date.toLocaleTimeString('fr-FR', {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest ${t.status === 'EN_ATTENTE' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>
                    {t.status}
                  </span>
                  <span className={`font-black text-xl w-32 text-right ${t.status === 'EN_ATTENTE' ? 'text-slate-400' : 'text-slate-900'}`}>
                    {new Intl.NumberFormat('fr-DZ').format(t.amount)} <span className="text-sm">DA</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}