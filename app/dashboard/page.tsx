import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Users, FileText, Wallet, PlaneTakeoff, TrendingUp, Sparkles, MapPin } from "lucide-react";
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-12 duration-1000 w-full pb-10">
      
      {/* HERO SECTION ULTRA PREMIUM */}
      <div className="ultra-glass p-10 md:p-14 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6 text-cyan-300 text-sm font-bold tracking-widest uppercase">
            <Sparkles className="h-4 w-4" /> Espace Premium
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
            Bonjour, <br /><span className="text-gradient-premium">{session.user.name}</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-light leading-relaxed">
            Votre agence de voyage est prête à conquérir le monde. Voici un aperçu luxueux de vos performances en temps réel.
          </p>
        </div>

        <div className="relative z-10 p-6 bg-black/30 rounded-3xl border border-white/10 backdrop-blur-xl text-center min-w-[250px]">
          <p className="text-sm font-medium text-slate-400 uppercase tracking-widest mb-2">Chiffre d'Affaires</p>
          <h2 className="text-5xl font-extrabold text-white drop-shadow-2xl">{new Intl.NumberFormat("fr-DZ").format(totalRevenue)} <span className="text-2xl text-cyan-400">DA</span></h2>
        </div>
      </div>

      {/* KPI CARDS (3D Hover Effect) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        
        {/* Card 1 */}
        <div className="ultra-glass p-8 card-3d-hover group">
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 bg-cyan-500/20 rounded-2xl border border-cyan-500/30 group-hover:bg-cyan-500/40 transition-colors">
              <Users className="h-8 w-8 text-cyan-300" />
            </div>
            <span className="text-5xl font-extrabold text-white/20 group-hover:text-cyan-400/20 transition-colors">01</span>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-white mb-1">{clientsCount}</h3>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Voyageurs Actifs</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="ultra-glass p-8 card-3d-hover group">
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 bg-orange-500/20 rounded-2xl border border-orange-500/30 group-hover:bg-orange-500/40 transition-colors">
              <PlaneTakeoff className="h-8 w-8 text-orange-300" />
            </div>
            <span className="text-5xl font-extrabold text-white/20 group-hover:text-orange-400/20 transition-colors">02</span>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-white mb-1">{bookingsCount}</h3>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Réservations Totales</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="ultra-glass p-8 card-3d-hover group">
          <div className="flex justify-between items-start mb-12">
            <div className="p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30 group-hover:bg-purple-500/40 transition-colors">
              <FileText className="h-8 w-8 text-purple-300" />
            </div>
            <span className="text-5xl font-extrabold text-white/20 group-hover:text-purple-400/20 transition-colors">03</span>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-white mb-1">{visasCount}</h3>
            <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">Dossiers Visas</p>
          </div>
        </div>
      </div>

      {/* GRAPHIQUES ET LISTES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
        
        {/* Le Graphique */}
        <div className="xl:col-span-2 ultra-glass p-8 w-full card-3d-hover">
          <div className="flex items-center justify-between mb-10 border-b border-white/10 pb-6">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Analyse Financière</h3>
              <p className="text-slate-400 font-medium mt-1">Vos performances sur l'année en cours.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <TrendingUp className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
          <div className="h-[350px] w-full opacity-90">
            <Overview data={chartData} />
          </div>
        </div>

        {/* Liste des derniers départs */}
        <div className="ultra-glass p-8 w-full flex flex-col h-full card-3d-hover">
          <h3 className="text-2xl font-extrabold text-white mb-2">Départs Récents</h3>
          <p className="text-slate-400 font-medium mb-8 pb-6 border-b border-white/10">Derniers voyageurs enregistrés.</p>
          
          <div className="space-y-4 flex-1">
            {recentBookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                <MapPin className="h-12 w-12 opacity-20" />
                <p>Aucun départ pour le moment.</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="group flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer hover:scale-105">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
                    <PlaneTakeoff className="h-6 w-6 text-cyan-400" />
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <p className="text-[16px] font-bold text-white truncate">{booking.client.lastName} {booking.client.firstName}</p>
                    <p className="text-sm text-slate-400 truncate">{booking.offer.title}</p>
                  </div>
                  <div className="text-right ml-2">
                    <span className="inline-block px-3 py-1.5 bg-cyan-500/20 text-cyan-300 font-bold text-sm rounded-xl border border-cyan-500/30">
                      VIP
                    </span>
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