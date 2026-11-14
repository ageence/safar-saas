export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SafarAIClient } from "./safar-ai-client";

export default async function SafarAIPage() {
  try {
    const session = await auth();
    const agencyId = session?.user?.agencyId;
    if (!agencyId) return <div className="p-10 text-center text-xl font-bold text-slate-800">Non autorisé. Veuillez vous connecter.</div>;

    // 🟢 SÉCURITÉ : On s'assure que même si la base est vide, on renvoie des tableaux vides (éviter le crash)
    const offers = (await prisma.offer.findMany({ where: { agencyId }, include: { bookings: true } })) || [];
    const allVisas = (await prisma.visaApplication.findMany({ where: { agencyId } })) || [];
    const bookings = (await prisma.booking.findMany({ where: { agencyId }, include: { offer: true } })) || [];
    const payments = (await prisma.payment.findMany({ where: { agencyId } })) || [];
    const clients = (await prisma.client.findMany({ where: { agencyId }, include: { bookings: true, visas: true } })) || [];

    let totalExpected = 0;
    bookings.forEach(b => totalExpected += (b.offer?.price || 0));
    allVisas.forEach(v => totalExpected += (v.price || 0));
    
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    const unpaidDebt = totalExpected - totalPaid;

    const approvedVisas = allVisas.filter(v => v.status === "APPROUVE").length;
    const closedVisas = allVisas.filter(v => v.status === "APPROUVE" || v.status === "REFUSE").length;
    const visaSuccessRate = closedVisas > 0 ? Math.round((approvedVisas / closedVisas) * 100) : 0;
    const returningClients = clients.filter(c => ((c.bookings?.length || 0) + (c.visas?.length || 0)) > 1).length;

    // L'objet des KPI sécurisé
    const metrics = {
      totalExpected: totalExpected || 0,
      unpaidDebt: unpaidDebt || 0,
      visaSuccessRate: visaSuccessRate || 0,
      returningClients: returningClients || 0
    };

    const sortedOffers = [...offers].sort((a, b) => (b.bookings?.length || 0) - (a.bookings?.length || 0));

    return <SafarAIClient offers={sortedOffers} metrics={metrics} />;
  } catch (error) {
    console.error("Erreur fatale Page AI:", error);
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-black text-rose-500 mb-4">Erreur de chargement</h2>
        <p className="text-slate-500">Un problème est survenu lors de la lecture de vos données. L'IA ne peut pas démarrer.</p>
      </div>
    );
  }
}