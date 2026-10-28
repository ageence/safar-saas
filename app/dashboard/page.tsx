import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Users, FileText, Wallet, PlaneTakeoff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Overview } from "./overview";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  // 1. Récupération des statistiques globales
  const clientsCount = await prisma.client.count({ where: { agencyId } });
  
  const visasCount = await prisma.visaApplication.count({ 
    where: { agencyId, status: { not: "APPROUVE" } } 
  });
  
  const bookingsCount = await prisma.booking.count({ where: { agencyId } });

  const payments = await prisma.payment.findMany({ where: { agencyId } });
  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  // 2. Préparation des données pour le graphique (Revenus par mois)
  const monthlyData: Record<string, number> = {};
  const moisNoms = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  
  payments.forEach((payment) => {
    const month = payment.createdAt.getMonth();
    const monthName = moisNoms[month];
    monthlyData[monthName] = (monthlyData[monthName] || 0) + payment.amount;
  });

  const chartData = Object.keys(monthlyData).map(key => ({
    name: key,
    total: monthlyData[key]
  }));

  // 3. Récupération des 5 dernières réservations pour le fil d'actualité
  const recentBookings = await prisma.booking.findMany({
    where: { agencyId },
    include: { client: true, offer: true },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vue d'ensemble</h1>
        <p className="text-muted-foreground">Bienvenue sur votre espace de gestion, {session.user.name}.</p>
      </div>

      {/* Les 4 cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clients Actifs</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientsCount}</div>
            <p className="text-xs text-muted-foreground">Enregistrés dans le CRM</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visas en cours</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{visasCount}</div>
            <p className="text-xs text-muted-foreground">Dossiers non finalisés</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("fr-DZ").format(totalRevenue)} DA
            </div>
            <p className="text-xs text-muted-foreground">Encaissements globaux</p>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Réservations</CardTitle>
            <PlaneTakeoff className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingsCount}</div>
            <p className="text-xs text-muted-foreground">Voyages et Omra</p>
          </CardContent>
        </Card>
      </div>

      {/* Section Graphique & Dernières actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-card">
          <CardHeader>
            <CardTitle>Évolution des revenus</CardTitle>
            <CardDescription>Encaissements par mois sur l'année en cours.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-card">
          <CardHeader>
            <CardTitle>Dernières Réservations</CardTitle>
            <CardDescription>Les 5 demandes les plus récentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {recentBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune réservation récente.</p>
              ) : (
                recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {booking.client.lastName} {booking.client.firstName}
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {booking.offer.title}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <Badge variant="outline" className="text-xs">
                        {new Intl.NumberFormat("fr-DZ").format(booking.offer.price)} DA
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}