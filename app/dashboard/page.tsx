import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Users, FileText, Wallet, PlaneTakeoff } from "lucide-react";
import { Overview } from "./overview";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  // Récupération des statistiques
  const clientsCount = await prisma.client.count({ where: { agencyId } });
  const visasCount = await prisma.visaApplication.count({ where: { agencyId, status: { not: "APPROUVE" } } });
  const bookingsCount = await prisma.booking.count({ where: { agencyId } });
  const payments = await prisma.payment.findMany({ where: { agencyId } });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  // Graphique
  const monthlyData: Record<string, number> = {};
  const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  payments.forEach((payment) => {
    const month = payment.createdAt.getMonth();
    const monthName = moisNoms[month];
    monthlyData[monthName] = (monthlyData[monthName] || 0) + payment.amount;
  });
  const chartData = Object.keys(monthlyData).map(key => ({ name: key, total: monthlyData[key] }));

  // Dernières réservations
  const recentBookings = await prisma.booking.findMany({
    where: { agencyId },
    include: { client: true, offer: true },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER : Titre avec gradient */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gradient">
          Bienvenue, {session.user.name}
        </h1>
        <p className="text-muted-foreground text-lg">Voici l'activité de votre agence aujourd'hui.</p>
      </div>

      {/* 4 CARTES STATISTIQUES VIBRANTES */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Carte 1 : Turquoise (Clients) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-lg hover-lift">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-cyan-50 font-medium mb-1">Clients Actifs</p>
              <h3 className="text-3xl font-bold">{clientsCount}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Carte 2 : Violet (Visas) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-400 to-purple-500 text-white shadow-lg hover-lift">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-violet-50 font-medium mb-1">Visas en cours</p>
              <h3 className="text-3xl font-bold">{visasCount}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Carte 3 : Corail/Orange (Revenus) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg hover-lift">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-orange-50 font-medium mb-1">Chiffre d'Affaires</p>
              <h3 className="text-3xl font-bold">{new Intl.NumberFormat("fr-DZ").format(totalRevenue)} DA</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Wallet className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        {/* Carte 4 : Émeraude (Réservations) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg hover-lift">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-emerald-50 font-medium mb-1">Réservations</p>
              <h3 className="text-3xl font-bold">{bookingsCount}</h3>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <PlaneTakeoff className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHIQUES ET ACTIVITÉ RÉCENTE (Glassmorphism) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        <div className="col-span-4 p-6 rounded-3xl glass-panel hover-lift">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground">Évolution des encaissements</h3>
            <p className="text-muted-foreground text-sm">Vue de vos revenus.</p>
          </div>
          <div className="h-[300px]">
            <Overview data={chartData} />
          </div>
        </div>

        <div className="col-span-3 p-6 rounded-3xl glass-panel hover-lift">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-foreground">Derniers Départs</h3>
            <p className="text-muted-foreground text-sm">Les 5 dernières réservations.</p>
          </div>
          <div className="space-y-6">
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Aucune réservation récente.</p>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center p-3 rounded-2xl transition-colors hover:bg-muted/50">
                  <div className="bg-primary/10 p-3 rounded-xl">
                    <PlaneTakeoff className="h-5 w-5 text-primary" />
                  </div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-bold text-foreground">{booking.client.lastName} {booking.client.firstName}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{booking.offer.title}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 border-none rounded-lg px-3 py-1 font-bold">
                      {new Intl.NumberFormat("fr-DZ").format(booking.offer.price)} DA
                    </Badge>
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