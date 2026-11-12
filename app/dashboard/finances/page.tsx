export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { FinancesClient } from "./finances-client";

export default async function FinancesPage({ searchParams }: { searchParams: Promise<{ dateDebut?: string, dateFin?: string }> }) {
  const session = await auth();
  if (!session?.user?.agencyId) return null;
  const sParams = await searchParams;
  
  // LOGIQUE DE FILTRAGE PAR DATES EXACTES
  let dateDebut = sParams.dateDebut ? new Date(sParams.dateDebut) : null;
  let dateFin = sParams.dateFin ? new Date(sParams.dateFin) : null;

  if (dateFin) {
    dateFin.setHours(23, 59, 59, 999);
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

  // REQUÊTES
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

  // CALCULS FINANCIERS AVANCÉS
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
  const totalReel = caTotal || 1;
  const pctVoyage = Math.round((caVoyage / totalReel) * 100);
  const pctVisa = Math.round((caVisa / totalReel) * 100);

  return (
    <FinancesClient 
      caTotal={caTotal}
      pctVoyage={pctVoyage}
      pctVisa={pctVisa}
      caEnAttente={caEnAttente}
      transactions={transactions}
      defaultDebut={sParams.dateDebut || ""}
      defaultFin={sParams.dateFin || ""}
    />
  );
}