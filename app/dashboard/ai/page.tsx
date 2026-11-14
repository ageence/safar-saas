export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SafarAIClient } from "./safar-ai-client";

export default async function SafarAIPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  // 🟢 EXTRACTION DE TOUTE LA BASE DE DONNÉES
  const offers = await prisma.offer.findMany({ where: { agencyId }, include: { bookings: true } });
  const allVisas = await prisma.visaApplication.findMany({ where: { agencyId } });
  const bookings = await prisma.booking.findMany({ where: { agencyId }, include: { offer: true, client: true }, orderBy: { createdAt: 'desc' } });
  const payments = await prisma.payment.findMany({ where: { agencyId }, orderBy: { createdAt: 'desc' } });
  const clients = await prisma.client.findMany({ where: { agencyId }, include: { bookings: true, visas: true } });

  // 1. FINANCES (Calculs millimétrés)
  let totalExpected = 0;
  bookings.forEach(b => totalExpected += (b.offer?.price || 0));
  allVisas.forEach(v => totalExpected += (v.price || 0));
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const unpaidDebt = totalExpected - totalPaid;

  // 2. VISAS (Répartition exacte)
  const visasStats = {
    total: allVisas.length,
    approved: allVisas.filter(v => v.status === "APPROUVE").length,
    refused: allVisas.filter(v => v.status === "REFUSE").length,
    pending: allVisas.filter(v => v.status === "EN_ATTENTE" || v.status === "EN_COURS").length,
    waitingDocs: allVisas.filter(v => v.status === "DOC_MANQUANTS").length,
  };
  const visaSuccessRate = (visasStats.approved + visasStats.refused) > 0 
    ? Math.round((visasStats.approved / (visasStats.approved + visasStats.refused)) * 100) : 0;

  // 3. VOYAGES ET OFFRES
  const sortedOffers = [...offers].sort((a, b) => b.bookings.length - a.bookings.length);
  const topOffer = sortedOffers.length > 0 ? sortedOffers[0] : null;
  const worstOffer = sortedOffers.length > 0 ? sortedOffers[sortedOffers.length - 1] : null;

  // 4. CLIENTS
  const returningClients = clients.filter(c => (c.bookings.length + c.visas.length) > 1).length;

  // 🟢 LE CERVEAU GLOBAL (Toutes les données sont injectées ici)
  const brainData = {
    agencyName: agencyId,
    finances: { totalExpected, totalPaid, unpaidDebt },
    visas: { ...visasStats, successRate: visaSuccessRate },
    clients: { total: clients.length, vip: returningClients, recent: clients.slice(0, 5) },
    offers: { total: offers.length, top: topOffer, worst: worstOffer, all: sortedOffers.map(o => ({title: o.title, bookings: o.bookings.length, seats: o.availableSeats})) },
    lastActivity: bookings.length > 0 ? bookings[0] : null
  };

  // 🟢 KPI SIMPLES POUR LE PANNEAU DROIT
  const metrics = {
    totalExpected, unpaidDebt, visaSuccessRate, returningClients
  };

  // 🟢 INSIGHTS VISUELS (Panneau droit)
  let insights: any[] = [];
  if (unpaidDebt > 0) insights.push({ type: "DEBT", color: "text-rose-500", bg: "bg-rose-50", titleKey: "unpaidDebtsAlert", dataAmount: unpaidDebt, text: `L'agence a ${unpaidDebt} DA de dettes.` });
  if (returningClients > 0) insights.push({ type: "VIP", color: "text-purple-500", bg: "bg-purple-50", titleKey: "vipClientsAlert", dataCount: returningClients, text: `Vous avez ${returningClients} clients VIP.` });
  if (topOffer && topOffer.bookings.length > 0) insights.push({ type: "SUCCESS", color: "text-emerald-500", bg: "bg-emerald-50", titleKey: "strongTrend", dataTitle: topOffer.title, text: `L'offre '${topOffer.title}' cartonne.` });
  if (visasStats.pending > 5) insights.push({ type: "ACTION", color: "text-indigo-500", bg: "bg-indigo-50", titleKey: "visaBottleneck", dataCount: visasStats.pending, text: `Attention, ${visasStats.pending} visas sont en attente.` });
  if (insights.length === 0) insights.push({ type: "INFO", color: "text-cyan-500", bg: "bg-cyan-50", titleKey: "learningInProgress", text: "L'IA analyse vos données..." });

  return <SafarAIClient insights={insights} offers={sortedOffers} metrics={metrics} brainData={brainData} />;
}