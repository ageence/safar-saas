export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { TrendingUp, AlertTriangle, Zap, BrainCircuit, Clock } from "lucide-react";
import { SafarAIClient } from "./safar-ai-client";

export default async function SafarAIPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  // ANALYSE DES DONNÉES PAR L'IA EN ARRIÈRE-PLAN
  const offers = await prisma.offer.findMany({
    where: { agencyId },
    include: { bookings: true }
  });

  const activeVisas = await prisma.visaApplication.count({
    where: { agencyId, status: "EN_ATTENTE" }
  });

  // Génération d'insights intelligents pour le Client Component
  let insights = [];
  
  if (offers.length > 0) {
    const sortedOffers = offers.sort((a, b) => b.bookings.length - a.bookings.length);
    const topOffer = sortedOffers[0];
    
    if (topOffer.bookings.length > 0) {
      insights.push({
        type: "SUCCESS", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50",
        titleKey: "strongTrend", dataTitle: topOffer.title
      });
    }

    const presquePlein = offers.find(o => o.availableSeats !== null && o.availableSeats > 0 && o.availableSeats <= 5);
    if (presquePlein) {
      insights.push({
        type: "WARNING", icon: Clock, color: "text-orange-500", bg: "bg-orange-50",
        titleKey: "imminentDepletion", dataTitle: presquePlein.title, dataSeats: presquePlein.availableSeats
      });
    }

    const lowPerf = sortedOffers[sortedOffers.length - 1];
    if (lowPerf.bookings.length === 0) {
      insights.push({
        type: "ALERT", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50",
        titleKey: "underperfOffer", dataTitle: lowPerf.title
      });
    }
  }

  if (activeVisas > 5) {
    insights.push({
      type: "ACTION", icon: Zap, color: "text-indigo-500", bg: "bg-indigo-50",
      titleKey: "visaBottleneck", dataCount: activeVisas
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "INFO", icon: BrainCircuit, color: "text-cyan-500", bg: "bg-cyan-50",
      titleKey: "learningInProgress"
    });
  }

  return <SafarAIClient insights={insights} offers={offers} />;
}