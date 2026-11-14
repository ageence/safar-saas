import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SafarAIClient } from "./safar-ai-client";

// Empêche la mise en cache statique qui peut crasher l'IA
export const dynamic = "force-dynamic";

export default async function SafarAIPage() {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    
    if (!agencyId) {
      return <div className="p-10 text-center font-bold">Non autorisé. Veuillez vous connecter.</div>;
    }

    // 1. Extraction sécurisée
    const offers = (await prisma.offer.findMany({ where: { agencyId }, include: { bookings: true } })) || [];
    const allVisas = (await prisma.visaApplication.findMany({ where: { agencyId } })) || [];
    const bookings = (await prisma.booking.findMany({ where: { agencyId }, include: { offer: true } })) || [];
    const payments = (await prisma.payment.findMany({ where: { agencyId } })) || [];
    const clients = (await prisma.client.findMany({ where: { agencyId }, include: { bookings: true, visas: true } })) || [];

    // 2. Calculs mathématiques sécurisés (Number)
    let totalExpected = 0;
    bookings.forEach(b => totalExpected += (Number(b.offer?.price) || 0));
    allVisas.forEach(v => totalExpected += (Number(v.price) || 0));
    
    const totalPaid = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const unpaidDebt = Math.max(0, totalExpected - totalPaid);

    const approvedVisas = allVisas.filter(v => v.status === "APPROUVE").length;
    const closedVisas = allVisas.filter(v => v.status === "APPROUVE" || v.status === "REFUSE").length;
    const visaSuccessRate = closedVisas > 0 ? Math.round((approvedVisas / closedVisas) * 100) : 0;
    const returningClients = clients.filter(c => ((c.bookings?.length || 0) + (c.visas?.length || 0)) > 1).length;

    const metrics = {
      totalExpected,
      unpaidDebt,
      visaSuccessRate,
      returningClients,
      clientsCount: clients.length,
      visasCount: allVisas.length
    };

    const sortedOffers = [...offers].sort((a, b) => (b.bookings?.length || 0) - (a.bookings?.length || 0));
    const topOffer = sortedOffers.length > 0 ? sortedOffers[0] : null;

    // 3. Insights
    let insights = [];
    if (unpaidDebt > 0) insights.push({ type: "DEBT", color: "text-rose-500", bg: "bg-rose-50", titleKey: "unpaidDebtsAlert", dataAmount: unpaidDebt, text: `Dettes en cours: ${unpaidDebt} DA.` });
    if (returningClients > 0) insights.push({ type: "VIP", color: "text-purple-500", bg: "bg-purple-50", titleKey: "vipClientsAlert", dataCount: returningClients, text: `${returningClients} clients VIP détectés.` });
    if (topOffer) insights.push({ type: "SUCCESS", color: "text-emerald-500", bg: "bg-emerald-50", titleKey: "strongTrend", dataTitle: topOffer.title, text: `L'offre '${topOffer.title}' cartonne.` });
    if (insights.length === 0) insights.push({ type: "INFO", color: "text-cyan-500", bg: "bg-cyan-50", titleKey: "learningInProgress", text: "Analyse en cours..." });

    // 🛑 LE FIX ABSOLU CONTRE LE CRASH NEXT.JS : On nettoie les objets Prisma complexes
    const safeInsights = JSON.parse(JSON.stringify(insights));
    const safeOffers = JSON.parse(JSON.stringify(sortedOffers));
    const safeMetrics = JSON.parse(JSON.stringify(metrics));

    return <SafarAIClient insights={safeInsights} offers={safeOffers} metrics={safeMetrics} />;
    
  } catch (error) {
    console.error("Erreur Critique Page AI:", error);
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center p-10">
        <h2 className="text-3xl font-black text-rose-500 mb-4">Système IA en maintenance</h2>
        <p className="text-slate-600 font-medium">Une erreur est survenue lors de la lecture de vos données, mais nous avons empêché l'application de crasher.</p>
      </div>
    );
  }
}