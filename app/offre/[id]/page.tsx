export const instant = false;

import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, CheckCircle2, ArrowRight, PlaneTakeoff, AlertTriangle } from "lucide-react";

export default async function PublicOfferPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ success?: string, error?: string }> }) {
  const { id } = await params;
  const sParams = await searchParams;
  
  const offerData = await prisma.offer.findUnique({
    where: { id },
    include: { agency: true }
  });

  if (!offerData) return notFound();
  const offer = offerData as any; 

  // ==========================================
  // PAGE SUCCÈS (MERCI POUR LA RÉSERVATION)
  // ==========================================
  if (sParams.success === "true") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="p-10 md:p-16 w-full max-w-xl text-center shadow-2xl bg-white border border-slate-100 rounded-[2.5rem] animate-in zoom-in-95 duration-700">
          <div className="mx-auto w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4">Réservation Confirmée !</h1>
          <p className="text-slate-500 text-lg font-medium mb-8">
            Un conseiller de <b>{offer.agency?.name || "notre agence"}</b> a reçu votre demande. Nous allons vous contacter rapidement pour ouvrir votre dossier et finaliser les documents.
          </p>
          <a href="/" className="inline-flex px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-cyan-600 transition-all shadow-lg">
            Fermer la page
          </a>
        </div>
      </div>
    );
  }

  const bgImage = offer.imageUrl || "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop";

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-cover bg-center transform scale-105" style={{ backgroundImage: `url('${bgImage}')` }} />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/40" />
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 w-fit shadow-2xl">
            <PlaneTakeoff className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-bold text-white uppercase">{offer.agency?.name || "Agence"} <span className="text-cyan-400">Présente</span></span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 drop-shadow-2xl">{offer.title}</h1>

          <div className="flex flex-wrap gap-6 mb-10">
            {offer.destination && (
              <div className="flex items-center gap-3 text-slate-200 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                <MapPin className="h-6 w-6 text-cyan-400" /> <span className="font-semibold text-lg">{offer.destination}</span>
              </div>
            )}
            {offer.startDate && (
              <div className="flex items-center gap-3 text-slate-200 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Calendar className="h-6 w-6 text-orange-400" />
                <span className="font-semibold text-lg">{new Date(offer.startDate).toLocaleDateString('fr-FR')} {offer.endDate && `- ${new Date(offer.endDate).toLocaleDateString('fr-FR')}`}</span>
              </div>
            )}
          </div>
          
          {offer.description && <p className="text-lg text-slate-300 font-medium mb-12 max-w-2xl">{offer.description}</p>}

          <div className="grid grid-cols-2 gap-6 max-w-xl">
            <div className="p-6 rounded-3xl bg-cyan-500/20 border border-cyan-500/30 backdrop-blur-md">
              <p className="text-cyan-300 font-bold uppercase text-xs mb-2">Places Dispo</p>
              <p className="text-4xl font-black text-white">{offer.totalSpots ?? "—"} <Users className="h-6 w-6 inline text-cyan-400 opacity-50" /></p>
            </div>
            <div className="p-6 rounded-3xl bg-orange-500/20 border border-orange-500/30 backdrop-blur-md">
              <p className="text-orange-300 font-bold uppercase text-xs mb-2">Tarif Exclusif</p>
              <p className="text-3xl font-black text-white">{offer.price ? new Intl.NumberFormat("fr-DZ").format(offer.price) : "Devis"} <span className="text-lg text-orange-400">DA</span></p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="glass-promax p-8 lg:p-10 w-full max-w-lg mx-auto shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-black text-slate-800 mb-2">Réservez votre place</h3>
            </div>

            {sParams.error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-600">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div className="text-xs font-bold break-all">Erreur : {sParams.error}</div>
              </div>
            )}

            {/* LE FORMULAIRE POINTE SUR LA NOUVELLE API VIA POST */}
            <form className="space-y-5" action="/api/book" method="POST">
              <input type="hidden" name="offerId" value={offer.id} />
              <input type="hidden" name="agencyId" value={offer.agencyId} />

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                  <input required name="lastName" type="text" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500" placeholder="Nom" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Prénom</label>
                  <input required name="firstName" type="text" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500" placeholder="Prénom" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Téléphone</label>
                <input required name="phone" type="tel" className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500" placeholder="0555 00 00 00" />
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-lg py-4 rounded-xl shadow-lg hover:-translate-y-1 transition-all">
                  Confirmer la demande
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}