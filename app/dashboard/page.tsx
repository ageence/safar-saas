import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Users, FileText, Wallet, PlaneTakeoff, TrendingUp, Activity, MapPin, Sparkles } from "lucide-react";
import { Overview } from "./overview";

export default async function DashboardPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  const clientsCount = await prisma.client.count({ where: { agencyId } });
  const visasCount = await prisma.visaApplication.count({ where: { agencyId, status: { not: "APPROUVE" } } });
  const bookingsCount = await prisma.booking.count({ where: { agencyId } });
  const payments = await prisma.payment.findMany({ where: { agencyId } });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  const monthlyData: Record<string, number> = {};
  const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  payments.forEach((p) => {
    const monthName = moisNoms[p.createdAt.getMonth()];
    monthlyData[monthName] = (monthlyData[monthName] || 0) + p.amount;
  });
  const chartData = Object.keys(monthlyData).map(key => ({ name: key, total: monthlyData[key] }));

  const recentBookings = await prisma.booking.findMany({
    where: { agencyId }, include: { client: true, offer: true }, orderBy: { createdAt: "desc" }, take: 4
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-700 w-full pb-10">
      
      {/* HEADER COMMAND CENTER (Light Mode) */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 mb-2">
            Vue d'ensemble.
          </h1>
          <p className="text-slate-600 font-medium text-lg">Préparez de nouveaux voyages, <span className="text-cyan-600 font-bold">{session.user.name}</span>.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-white shadow-sm backdrop-blur-md">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-slate-700">Agence en ligne</span>
        </div>
      </div>

      {/* BENTO GRID - LIGHT PREMIUM */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        
        {/* CARTE REVENUE (Large, prend 8 colonnes) */}
        <div className="premium-glass col-span-1 md:col-span-8 p-8 md:p-10 flex flex-col justify-between relative group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-100 to-transparent rounded-full blur-[60px] pointer-events-none group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-orange-400" /> Trésorerie Globale
              </p>
              <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter">
                {new Intl.NumberFormat("fr-DZ").format(totalRevenue)} <span className="text-3xl text-gradient-ocean">DA</span>
              </h2>
            </div>
            <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-blue-100 shadow-sm hidden sm:block">
              <Wallet className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-emerald-600 font-bold relative z-10 bg-emerald-50 w-fit px-4 py-2 rounded-xl">
            <TrendingUp className="h-5 w-5" />
            <span>Excellente performance ce mois-ci</span>
          </div>
        </div>

        {/* CARTE CLIENTS (Prend 4 colonnes) */}
        <div className="premium-glass col-span-1 md:col-span-4 p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Voyageurs</p>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-slate-900 mb-2">{clientsCount}</h3>
            <p className="text-sm text-slate-500 font-medium">Comptes enregistrés</p>
          </div>
        </div>

        {/* CARTE VISAS (Prend 4 colonnes) */}
        <div className="premium-glass col-span-1 md:col-span-4 p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Visas Actifs</p>
            <div className="p-2 bg-purple-50 rounded-lg group-hover:scale-110 transition-transform">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-slate-900 mb-2">{visasCount}</h3>
            <p className="text-sm text-slate-500 font-medium">Dossiers en cours</p>
          </div>
        </div>

        {/* CARTE RESERVATIONS (Prend 4 colonnes) */}
        <div className="premium-glass col-span-1 md:col-span-4 p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Réservations</p>
            <div className="p-2 bg-orange-50 rounded-lg group-hover:scale-110 transition-transform">
              <PlaneTakeoff className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-slate-900 mb-2">{bookingsCount}</h3>
            <p className="text-sm text-slate-500 font-medium">Voyages & Omra</p>
          </div>
        </div>

        {/* GRAPHIQUE (Prend 8 colonnes) */}
        <div className="premium-glass col-span-1 md:col-span-8 p-8">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">Flux Financier Annuel</h3>
            <Activity className="h-5 w-5 text-slate-400" />
          </div>
          <div className="h-[300px] w-full">
            <Overview data={chartData} />
          </div>
        </div>

        {/* DERNIERS DEPARTS (Prend 4 colonnes) */}
        <div className="premium-glass col-span-1 md:col-span-4 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-800">Départs Récents</h3>
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>
          
          <div className="space-y-4 flex-1">
            {recentBookings.length === 0 ? (
              <p className="text-slate-400 text-sm font-medium text-center mt-10">Aucune activité récente.</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 group cursor-pointer p-3 rounded-2xl hover:bg-white/80 transition-colors shadow-sm border border-transparent hover:border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                    <PlaneTakeoff className="h-5 w-5 text-cyan-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[15px] font-bold text-slate-900 truncate">{booking.client.lastName} {booking.client.firstName}</p>
                    <p className="text-xs font-semibold text-slate-500 truncate">{booking.offer.title}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}