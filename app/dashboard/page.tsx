import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Users, FileText, Wallet, PlaneTakeoff, TrendingUp, Activity, MapPin } from "lucide-react";
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
      
      {/* HEADER COMMAND CENTER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-2 text-glow">
            Overview.
          </h1>
          <p className="text-slate-400 font-medium">Bienvenue, <span className="text-cyan-400">{session.user.name}</span>. Vos indicateurs de performance en temps réel.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-semibold text-emerald-400">Système En Ligne</span>
        </div>
      </div>

      {/* BENTO GRID (Layout Asymétrique Premium) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
        
        {/* CARTE REVENUE (Large, prend 8 colonnes) */}
        <div className="bento-card col-span-1 md:col-span-8 p-8 md:p-10 flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Chiffre d'Affaires Global</p>
              <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter">
                {new Intl.NumberFormat("fr-DZ").format(totalRevenue)} <span className="text-3xl text-cyan-500">DA</span>
              </h2>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hidden sm:block">
              <Wallet className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-emerald-400 font-medium relative z-10">
            <TrendingUp className="h-5 w-5" />
            <span>Excellente performance ce mois-ci</span>
          </div>
        </div>

        {/* CARTE CLIENTS (Prend 4 colonnes) */}
        <div className="bento-card col-span-1 md:col-span-4 p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Voyageurs</p>
            <Users className="h-5 w-5 text-slate-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-white mb-2">{clientsCount}</h3>
            <p className="text-sm text-slate-500">Comptes enregistrés dans la base</p>
          </div>
        </div>

        {/* CARTE VISAS (Prend 4 colonnes) */}
        <div className="bento-card col-span-1 md:col-span-4 p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Visas Actifs</p>
            <FileText className="h-5 w-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-white mb-2">{visasCount}</h3>
            <p className="text-sm text-slate-500">Dossiers en cours de traitement</p>
          </div>
        </div>

        {/* CARTE RESERVATIONS (Prend 4 colonnes) */}
        <div className="bento-card col-span-1 md:col-span-4 p-8 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Réservations</p>
            <PlaneTakeoff className="h-5 w-5 text-slate-500 group-hover:text-orange-400 transition-colors" />
          </div>
          <div>
            <h3 className="text-5xl font-extrabold text-white mb-2">{bookingsCount}</h3>
            <p className="text-sm text-slate-500">Voyages et Omra validés</p>
          </div>
        </div>

        {/* GRAPHIQUE (Prend 8 colonnes) */}
        <div className="bento-card col-span-1 md:col-span-8 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Flux Financier</h3>
            <Activity className="h-5 w-5 text-slate-500" />
          </div>
          <div className="h-[300px] w-full">
            <Overview data={chartData} />
          </div>
        </div>

        {/* DERNIERS DEPARTS (Prend 4 colonnes) */}
        <div className="bento-card col-span-1 md:col-span-4 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-white">Activité Récente</h3>
            <MapPin className="h-5 w-5 text-slate-500" />
          </div>
          
          <div className="space-y-4 flex-1">
            {recentBookings.length === 0 ? (
              <p className="text-slate-500 text-sm">Aucune activité récente.</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
                    <PlaneTakeoff className="h-5 w-5 text-slate-400 group-hover:text-cyan-400" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[15px] font-bold text-white truncate">{booking.client.lastName} {booking.client.firstName}</p>
                    <p className="text-xs text-slate-400 truncate">{booking.offer.title}</p>
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