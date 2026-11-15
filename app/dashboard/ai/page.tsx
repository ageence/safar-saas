import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SafarAIClient } from "./safar-ai-client";

export default async function SafarAIPage() {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    
    if (!agencyId) {
      return <div className="p-10 text-center font-bold">Non autorisé.</div>;
    }

    // 🛑 EXTRACTION SÉCURISÉE : UNIQUEMENT DES CHIFFRES SIMPLES (0 CRASH)
    const offers = await prisma.offer.findMany({
      where: { agencyId },
      select: { id: true, title: true, availableSeats: true, totalSpots: true, price: true, bookings: { select: { id: true } } }
    });
    const visas = await prisma.visaApplication.findMany({
      where: { agencyId },
      select: { id: true, status: true, price: true }
    });
    const clients = await prisma.client.findMany({
      where: { agencyId },
      select: { id: true, bookings: { select: { id: true } }, visas: { select: { id: true } } }
    });
    const payments = await prisma.payment.findMany({
      where: { agencyId },
      select: { amount: true }
    });

    // 🟢 CALCULS 100% SÛRS
    let totalExpected = 0;
    offers.forEach(o => totalExpected += ((Number(o.price) || 0) * o.bookings.length));
    visas.forEach(v => totalExpected += (Number(v.price) || 0));
    
    const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const unpaidDebt = Math.max(0, totalExpected - totalPaid);

    const approvedVisas = visas.filter(v => v.status === "APPROUVE").length;
    const closedVisas = visas.filter(v => v.status === "APPROUVE" || v.status === "REFUSE").length;
    const visaSuccessRate = closedVisas > 0 ? Math.round((approvedVisas / closedVisas) * 100) : 0;
    
    const returningClients = clients.filter(c => (c.bookings.length + c.visas.length) > 1).length;

    // 🟢 FORMATAGE PROPRE POUR LE CLIENT
    const metrics = {
      totalExpected, unpaidDebt, visaSuccessRate, returningClients,
      clientsCount: clients.length, visasCount: visas.length
    };

    const sortedOffers = offers
      .sort((a, b) => b.bookings.length - a.bookings.length)
      .map(o => ({ title: o.title, bookingsCount: o.bookings.length, availableSeats: o.availableSeats, totalSpots: o.totalSpots }));

    const topOffer = sortedOffers.length > 0 ? sortedOffers[0] : null;

    let insights = [];
    if (unpaidDebt > 0) insights.push({ type: "DEBT", color: "text-rose-500", bg: "bg-rose-50", titleKey: "Dettes", text: `Attention : ${unpaidDebt} DA de dettes en cours.` });
    if (returningClients > 0) insights.push({ type: "VIP", color: "text-purple-500", bg: "bg-purple-50", titleKey: "VIP", text: `${returningClients} clients VIP détectés.` });
    if (topOffer) insights.push({ type: "SUCCESS", color: "text-emerald-500", bg: "bg-emerald-50", titleKey: "Tendance", text: `L'offre '${topOffer.title}' cartonne.` });
    if (insights.length === 0) insights.push({ type: "INFO", color: "text-cyan-500", bg: "bg-cyan-50", titleKey: "Info", text: "Analyse en cours..." });

    return <SafarAIClient insights={insights} offers={sortedOffers} metrics={metrics} />;
    
  } catch (error) {
    console.error("Erreur Serveur Page AI:", error);
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-10">
        <h2 className="text-3xl font-black text-rose-500 mb-4">Système IA en maintenance</h2>
        <p className="text-slate-600 font-medium">L'IA est en cours d'initialisation.</p>
      </div>
    );
  }
}