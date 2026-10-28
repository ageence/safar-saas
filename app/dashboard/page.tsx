import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Users, FileText, Wallet, PlaneTakeoff, TrendingUp, Palmtree } from "lucide-react";
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
    where: { agencyId }, include: { client: true, offer: true }, orderBy: { createdAt: "desc" }, take: 5
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full">
      
      {/* HEADER : Titre majestueux */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-2">
            Bonjour, <span className="text-gradient">{session.user.name}</span> <Palmtree className="inline h-10 w-10 text-orange-500 mb-2"/>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium">Votre agence décolle aujourd'hui. Voici vos performances.</p>
        </div>
      </div>

      {/* 4 CARTES STATISTIQUES : Pleine largeur, design hyper premium avec icônes en filigrane */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full">
        
        {/* Carte 1 : Océan */}
        <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-xl shadow-blue-500/20 hover-lift group w-full">
          <Users className="absolute -right-6 -bottom-6 h-40 w-40 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <p className="text-cyan-100 font-semibold text-lg mb-2">Total Clients</p>
            <h3 className="text-5xl font-extrabold">{clientsCount}</h3>
          </div>
        </div>

        {/* Carte 2 : Sunset */}
        <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-xl shadow-rose-500/20 hover-lift group w-full">
          <PlaneTakeoff className="absolute -right-6 -bottom-6 h-40 w-40 text-white opacity-10 group-hover:scale-110 group-hover:-translate-y-4 transition-transform duration-500" />
          <div className="relative z-10">
            <p className="text-orange-100 font-semibold text-lg mb-2">Réservations</p>
            <h3 className="text-5xl font-extrabold">{bookingsCount}</h3>
          </div>
        </div>

        {/* Carte 3 : Améthyste */}
        <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-violet-500 to-purple-700 text-white shadow-xl shadow-purple-500/20 hover-lift group w-full">
          <FileText className="absolute -right-6 -bottom-6 h-40 w-40 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <p className="text-violet-100 font-semibold text-lg mb-2">Visas Actifs</p>
            <h3 className="text-5xl font-extrabold">{visasCount}</h3>
          </div>
        </div>

        {/* Carte 4 : Émeraude / Finance */}
        <div className="relative overflow-hidden p-8 rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-xl shadow-teal-500/20 hover-lift group w-full">
          <Wallet className="absolute -right-6 -bottom-6 h-40 w-40 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10">
            <p className="text-emerald-100 font-semibold text-lg mb-2">Revenus Globaux</p>
            <h3 className="text-4xl font-extrabold truncate">{new Intl.NumberFormat("fr-DZ").format(totalRevenue)} DA</h3>
          </div>
        </div>
      </div>

      {/* GRAPHIQUES ET LISTES : Utilisation parfaite de l'espace (pas de vide à droite) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 w-full">
        
        {/* Le Graphique prend 2 colonnes sur 3 sur grand écran */}
        <div className="xl:col-span-2 glass-panel p-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-800">Évolution Financière</h3>
              <p className="text-slate-500 font-medium">Trésorerie encaissée cette année.</p>
            </div>
            <div className="p-3 bg-cyan-100 text-cyan-600 rounded-2xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="h-[350px] w-full">
            <Overview data={chartData} />
          </div>
        </div>

        {/* Liste des derniers départs (1 colonne sur 3) */}
        <div className="glass-panel p-8 w-full flex flex-col h-full">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Départs Récents</h3>
          <p className="text-slate-500 font-medium mb-8">Les 5 dernières ventes.</p>
          
          <div className="space-y-4 flex-1">
            {recentBookings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <PlaneTakeoff className="h-12 w-12 opacity-20" />
                <p>Aucun départ pour le moment.</p>
              </div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="group flex items-center p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all hover:border-cyan-200">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-cyan-100 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlaneTakeoff className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-[15px] font-bold text-slate-800">{booking.client.lastName} {booking.client.firstName}</p>
                    <p className="text-sm text-slate-500 truncate">{booking.offer.title}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1.5 bg-orange-100 text-orange-600 font-bold text-sm rounded-xl">
                      {new Intl.NumberFormat("fr-DZ").format(booking.offer.price)} DA
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