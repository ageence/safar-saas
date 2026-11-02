export const instant = false;

import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Calendar, MapPin, Users, CheckCircle2, ArrowRight, PlaneTakeoff } from "lucide-react";

// ACTION SERVEUR : C'est ici que la réservation est enregistrée dans ton tableau de bord (Admin) !
async function bookOfferAction(formData: FormData) {
  "use server";
  
  const offerId = formData.get("offerId") as string;
  const agencyId = formData.get("agencyId") as string;
  const lastName = formData.get("lastName") as string;
  const firstName = formData.get("firstName") as string;
  const phone = formData.get("phone") as string;
  const passport = formData.get("passport") as string;

  try {
    // 1. On crée le Client dans l'agence (pour qu'il apparaisse dans ton CRM)
    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        phone,
        agencyId,
      } as any // as any pour éviter les blocages TS si tu as d'autres champs
    });

    // 2. On crée la Réservation (Booking) et on la lie au client et à l'offre
    await prisma.booking.create({
      data: {
        clientId: client.id,
        offerId: offerId,
        agencyId: agencyId,
        // On peut rajouter le passeport ici ou dans le dossier client plus tard
      } as any
    });

    // 3. On redirige vers la page de succès !
    redirect(`/offre/${offerId}?success=true`);
  } catch (error) {
    console.error("Erreur de réservation:", error);
    // Redirection simple si ça plante
    redirect(`/offre/${offerId}?error=true`);
  }
}

export default async function PublicOfferPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ success?: string }> }) {
  const { id } = await params;
  const sParams = await searchParams; // Next.js 15
  
  const offerData = await prisma.offer.findUnique({
    where: { id },
    include: { agency: true }
  });

  if (!offerData) return notFound();
  
  const offer = offerData as any; 

  // ==========================================
  // L'ÉCRAN DE SUCCÈS (Page "Merci")
  // ==========================================
  if (sParams.success === "true") {
    return (
      <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-slate-50 p-6">
        <div className="glass-promax p-10 md:p-16 w-full max-w-xl text-center shadow-2xl animate-in zoom-in-95 duration-700">
          <div className="mx-auto w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tighter">Réservation Confirmée !</h1>
          <p className="text-slate-500 text-lg font-medium mb-8">
            Merci <span className="font-bold text-slate-700">pour votre confiance</span>. 
            Un agent de notre agence <b>{offer.agency?.name}</b> a bien reçu votre demande et vous contactera dans les plus brefs délais pour valider votre dossier et votre paiement.
          </p>
          <a href="/" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-cyan-600 transition-all shadow-lg hover:shadow-cyan-500/30">
            Fermer cette page
          </a>
        </div>
      </div>
    );
  }

  // ==========================================
  // LA PAGE NORMALE DU VOYAGE (Avec le Formulaire)
  // ==========================================
  const defaultImage = offer.type === "OMRA" 
    ? "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2000&auto=format&fit=crop" 
    : "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop";
    
  const bgImage = offer.imageUrl || defaultImage;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden selection:bg-cyan-500/30">
      
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 animate-[slowPan_30s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/40" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 flex flex-col justify-center animate-in fade-in slide-in-from-left-10 duration-1000">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 w-fit shadow-2xl">
            <PlaneTakeoff className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-bold tracking-widest uppercase text-white">
              {offer.agency?.name || "Agence"} <span className="text-cyan-400">Présente</span>
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6 leading-tight drop-shadow-2xl">
            {offer.title}
          </h1>

          <div className="flex flex-wrap gap-6 mb-10">
            {offer.destination && (
              <div className="flex items-center gap-3 text-slate-200 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                <MapPin className="h-6 w-6 text-cyan-400" />
                <span className="font-semibold text-lg">{offer.destination}</span>
              </div>
            )}
            
            {(offer.startDate) && (
              <div className="flex items-center gap-3 text-slate-200 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Calendar className="h-6 w-6 text-orange-400" />
                <span className="font-semibold text-lg">
                  {new Date(offer.startDate).toLocaleDateString('fr-FR')}
                  {(offer.endDate) && ` - ${new Date(offer.endDate).toLocaleDateString('fr-FR')}`}
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-xl">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 backdrop-blur-md">
              <p className="text-cyan-300 font-bold uppercase tracking-wider text-xs mb-2">Places Dispo</p>
              <p className="text-4xl font-black text-white flex items-center gap-3">
                {offer.totalSpots ?? "—"} <Users className="h-6 w-6 text-cyan-400 opacity-50" />
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500/20 to-rose-600/20 border border-orange-500/30 backdrop-blur-md">
              <p className="text-orange-300 font-bold uppercase tracking-wider text-xs mb-2">Tarif Exclusif</p>
              <p className="text-3xl font-black text-white">
                {offer.price ? new Intl.NumberFormat("fr-DZ").format(offer.price) : "Sur devis"} <span className="text-lg text-orange-400">DA</span>
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
          <div className="glass-promax p-8 lg:p-10 w-full max-w-lg mx-auto shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-slate-800 mb-2">Réservez votre place</h3>
              <p className="text-slate-500 font-medium">Remplissez vos informations, notre agence vous contactera immédiatement.</p>
            </div>

            {/* LE FORMULAIRE APPELLE L'ACTION SERVEUR CRÉÉE EN HAUT */}
            <form className="space-y-5" action={bookOfferAction}>
              {/* Champs cachés nécessaires pour la base de données */}
              <input type="hidden" name="offerId" value={offer.id} />
              <input type="hidden" name="agencyId" value={offer.agencyId} />

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nom</label>
                  <input required name="lastName" type="text" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="Votre nom" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prénom</label>
                  <input required name="firstName" type="text" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="Votre prénom" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Numéro de téléphone</label>
                <input required name="phone" type="tel" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="0555 00 00 00" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">N° Passeport (Optionnel)</label>
                <input name="passport" type="text" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="Numéro de passeport" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg py-4 rounded-xl shadow-[0_10px_20px_rgba(14,165,233,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                  Confirmer ma demande <ArrowRight className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs font-bold text-slate-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Vos données sont sécurisées
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}