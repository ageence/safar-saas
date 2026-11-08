export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Sparkles, TrendingUp, AlertTriangle, Zap, BrainCircuit, BarChart3, Clock } from "lucide-react";

export default async function SafarAIPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  // 🟢 ANALYSE DES DONNÉES PAR L'IA EN ARRIÈRE-PLAN
  const offers = await prisma.offer.findMany({
    where: { agencyId },
    include: { bookings: true }
  });

  const activeVisas = await prisma.visaApplication.count({
    where: { agencyId, status: "EN_ATTENTE" }
  });

  // Génération d'insights intelligents
  let insights = [];
  
  if (offers.length > 0) {
    // Trier par le plus populaire
    const sortedOffers = offers.sort((a, b) => b.bookings.length - a.bookings.length);
    const topOffer = sortedOffers[0];
    
    if (topOffer.bookings.length > 0) {
      insights.push({
        type: "SUCCESS", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50",
        title: "Tendance Forte Détectée",
        message: `L'offre "${topOffer.title}" génère le plus de trafic. Pensez à augmenter le prix de 5% ou lancer une campagne publicitaire ciblée.`
      });
    }

    // Détection d'épuisement des stocks
    const presquePlein = offers.find(o => o.availableSeats !== null && o.availableSeats > 0 && o.availableSeats <= 5);
    if (presquePlein) {
      insights.push({
        type: "WARNING", icon: Clock, color: "text-orange-500", bg: "bg-orange-50",
        title: "Épuisement imminent",
        message: `Il ne reste que ${presquePlein.availableSeats} places pour "${presquePlein.title}". L'IA estime une clôture dans moins de 48 heures. Préparez vos billets.`
      });
    }

    // Détection de sous-performance
    const lowPerf = sortedOffers[sortedOffers.length - 1];
    if (lowPerf.bookings.length === 0) {
      insights.push({
        type: "ALERT", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50",
        title: "Offre sous-performante",
        message: `L'offre "${lowPerf.title}" n'a généré aucun client. Créez un "Lien Public" et partagez-le sur Instagram pour booster l'engagement.`
      });
    }
  }

  if (activeVisas > 5) {
    insights.push({
      type: "ACTION", icon: Zap, color: "text-indigo-500", bg: "bg-indigo-50",
      title: "Goulot d'étranglement Visa",
      message: `Vous avez ${activeVisas} dossiers Visa en attente. Contactez rapidement vos clients pour finaliser les documents avant la hausse des prix des RDV.`
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "INFO", icon: BrainCircuit, color: "text-cyan-500", bg: "bg-cyan-50",
      title: "Apprentissage en cours",
      message: "L'IA analyse actuellement votre agence. Continuez d'ajouter des clients et des offres pour générer des recommandations."
    });
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      <div className="glass-promax p-10 rounded-[2.5rem] relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] opacity-30 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-500/20 border border-indigo-400/30 rounded-2xl shadow-lg text-indigo-300">
              <Sparkles className="h-10 w-10 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                Safar AI <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1">Copilot</Badge>
              </h1>
              <p className="text-slate-400 font-medium mt-2 max-w-lg">L'intelligence artificielle analyse les données de votre agence en temps réel pour maximiser vos profits.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-600" /> Recommandations Stratégiques
          </h2>
          
          <div className="grid grid-cols-1 gap-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex items-start gap-5">
                <div className={`p-4 rounded-2xl ${insight.bg} ${insight.color} shadow-inner`}>
                  <insight.icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 mb-1">{insight.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{insight.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-slate-800" /> Vitesse de Vente
          </h2>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
            {offers.slice(0, 3).map(offer => {
              const fillRate = offer.totalSpots ? Math.round(((offer.totalSpots - (offer.availableSeats||0)) / offer.totalSpots) * 100) : 0;
              return (
                <div key={offer.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold text-slate-700">
                    <span className="truncate pr-4">{offer.title}</span>
                    <span>{fillRate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${fillRate > 80 ? 'bg-rose-500' : fillRate > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${fillRate}%` }}></div>
                  </div>
                  <p className="text-xs font-bold text-slate-400 text-right">
                    {fillRate > 80 ? '⚠️ Presque complet' : '🟢 Places disponibles'}
                  </p>
                </div>
              );
            })}
            {offers.length === 0 && <p className="text-slate-400 text-sm font-bold text-center py-4">Aucune donnée de vente pour le moment.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant local pour le badge
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return <span className={`px-2.5 py-0.5 rounded-full font-bold ${className}`}>{children}</span>;
}