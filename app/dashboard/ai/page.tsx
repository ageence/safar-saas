export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SafarAIClient } from "./safar-ai-client";

export default async function SafarAIPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  // 🟢 L'IA COLLECTE ABSOLUMENT TOUTES LES DONNÉES
  const offers = await prisma.offer.findMany({ where: { agencyId }, include: { bookings: true } });
  const allVisas = await prisma.visaApplication.findMany({ where: { agencyId } });
  const bookings = await prisma.booking.findMany({ where: { agencyId }, include: { offer: true } });
  const payments = await prisma.payment.findMany({ where: { agencyId } });
  const clients = await prisma.client.findMany({ where: { agencyId }, include: { bookings: true, visas: true } });

  // 1. Calculs Financiers
  let totalExpected = 0;
  bookings.forEach(b => totalExpected += (b.offer?.price || 0));
  allVisas.forEach(v => totalExpected += (v.price || 0));
  
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const unpaidDebt = totalExpected - totalPaid;

  // 2. Calculs Visas
  const approvedVisas = allVisas.filter(v => v.status === "APPROUVE").length;
  const closedVisas = allVisas.filter(v => v.status === "APPROUVE" || v.status === "REFUSE").length;
  const visaSuccessRate = closedVisas > 0 ? Math.round((approvedVisas / closedVisas) * 100) : 0;

  // 3. Calculs Clients & VIP
  const returningClients = clients.filter(c => (c.bookings.length + c.visas.length) > 1).length;

  // 🟢 NOUVEAU : On compile toutes les stats pour le Cerveau de l'IA
  const metrics = {
    totalExpected,
    unpaidDebt,
    visaSuccessRate,
    returningClients,
    clientsCount: clients.length,         // Pour répondre à "Combien de clients"
    visasCount: allVisas.length,          // Pour répondre à "Combien de visas"
    bookingsCount: bookings.length,       // Pour répondre à "Combien de réservations"
    activeVisas: allVisas.filter(v => v.status === "EN_ATTENTE" || v.status === "EN_COURS").length
  };

  // 🟢 GÉNÉRATION DU PLAN D'ACTION (Insights)
  let insights: any[] = [];
  
  if (unpaidDebt > 0) {
    insights.push({
      type: "DEBT", color: "text-rose-500", bg: "bg-rose-50",
      titleKey: "unpaidDebtsAlert", dataAmount: unpaidDebt, text: `L'agence a ${unpaidDebt} DA de dettes en attente.`
    });
  }

  if (returningClients > 0) {
    insights.push({
      type: "VIP", color: "text-purple-500", bg: "bg-purple-50",
      titleKey: "vipClientsAlert", dataCount: returningClients, text: `Vous avez ${returningClients} clients VIP prêts pour une relance.`
    });
  }

  if (offers.length > 0) {
    const sortedOffers = offers.sort((a, b) => b.bookings.length - a.bookings.length);
    const topOffer = sortedOffers[0];
    
    if (topOffer.bookings.length > 0) {
      insights.push({
        type: "SUCCESS", color: "text-emerald-500", bg: "bg-emerald-50",
        titleKey: "strongTrend", dataTitle: topOffer.title, text: `L'offre '${topOffer.title}' cartonne en ce moment.`
      });
    }

    const presquePlein = offers.find(o => o.availableSeats !== null && o.availableSeats > 0 && o.availableSeats <= 5);
    if (presquePlein) {
      insights.push({
        type: "WARNING", color: "text-orange-500", bg: "bg-orange-50",
        titleKey: "imminentDepletion", dataTitle: presquePlein.title, dataSeats: presquePlein.availableSeats, text: `Attention, il ne reste que ${presquePlein.availableSeats} places pour '${presquePlein.title}'.`
      });
    }

    const lowPerf = sortedOffers[sortedOffers.length - 1];
    if (lowPerf.bookings.length === 0) {
      insights.push({
        type: "ALERT", color: "text-red-500", bg: "bg-red-50",
        titleKey: "underperfOffer", dataTitle: lowPerf.title, text: `L'offre '${lowPerf.title}' ne génère aucune vente.`
      });
    }
  }

  if (metrics.activeVisas > 5) {
    insights.push({
      type: "ACTION", color: "text-indigo-500", bg: "bg-indigo-50",
      titleKey: "visaBottleneck", dataCount: metrics.activeVisas, text: `Vous avez ${metrics.activeVisas} visas en attente de traitement.`
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "INFO", color: "text-cyan-500", bg: "bg-cyan-50",
      titleKey: "learningInProgress", text: "L'IA analyse vos données pour trouver des recommandations."
    });
  }

  return <SafarAIClient insights={insights} offers={offers} metrics={metrics} />;
}