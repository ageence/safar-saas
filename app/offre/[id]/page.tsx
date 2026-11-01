import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, CheckCircle2, ArrowRight, PlaneTakeoff } from "lucide-react";

export default async function PublicOfferPage({ params }: { params: { id: string } }) {
  // 1. Récupérer l'offre depuis la base de données
  const offer = await prisma.offer.findUnique({
    where: { id: params.id },
    include: { agency: true }
  });

  if (!offer) return notFound();

  // 2. Image par défaut ultra luxe si l'agence n'a pas mis de lien
  const defaultImage = offer.type === "OMRA" 
    ? "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2000&auto=format&fit=crop" 
    : "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=2000&auto=format&fit=crop";
    
  const bgImage = offer.imageUrl || defaultImage;

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden selection:bg-cyan-500/30">
      
      {/* BACKGROUND IMAGE & OVERLAYS */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105 animate-[slowPan_30s_ease-in-out_infinite_alternate]"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        {/* Dégradé sombre pour que le texte soit lisible */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/40" />
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* COLONNE GAUCHE (Détails du voyage) */}
        <div className="lg:col-span-7 flex flex-col justify-center animate-in fade-in slide-in-from-left-10 duration-1000">
          
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8 w-fit shadow-2xl">
            <PlaneTakeoff className="h-5 w-5 text-cyan-400" />
            <span className="text-sm font-bold tracking-widest uppercase text-white">
              {offer.agency.name} <span className="text-cyan-400">Présente</span>
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white mb-6 leading-tight drop-shadow-2xl">
            {offer.title}
          </h1>

          <div className="flex flex-wrap gap-6 mb-10">
            <div className="flex items-center gap-3 text-slate-200 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
              <MapPin className="h-6 w-6 text-cyan-400" />
              <span className="font-semibold text-lg">{offer.destination}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-200 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 backdrop-blur-sm">
              <Calendar className="h-6 w-6 text-orange-400" />
              <span className="font-semibold text-lg">{offer.startDate.toLocaleDateString('fr-FR')} - {offer.endDate.toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          {offer.description && (
            <p className="text-lg text-slate-300 font-medium mb-12 max-w-2xl leading-relaxed">
              {offer.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-6 max-w-xl">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 backdrop-blur-md">
              <p className="text-cyan-300 font-bold uppercase tracking-wider text-xs mb-2">Places Dispo</p>
              <p className="text-4xl font-black text-white flex items-center gap-3">
                {offer.availableSpots} <Users className="h-6 w-6 text-cyan-400 opacity-50" />
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-500/20 to-rose-600/20 border border-orange-500/30 backdrop-blur-md">
              <p className="text-orange-300 font-bold uppercase tracking-wider text-xs mb-2">Tarif Exclusif</p>
              <p className="text-3xl font-black text-white">
                {new Intl.NumberFormat("fr-DZ").format(offer.price)} <span className="text-lg text-orange-400">DA</span>
              </p>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE (Formulaire de Réservation VIP) */}
        <div className="lg:col-span-5 animate-in fade-in slide-in-from-right-10 duration-1000 delay-200">
          <div className="glass-promax p-8 lg:p-10 w-full max-w-lg mx-auto shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-slate-800 mb-2">Réservez votre place</h3>
              <p className="text-slate-500 font-medium">Remplissez vos informations, notre agence vous contactera immédiatement.</p>
            </div>

            {/* ACTION DU FORMULAIRE : A relier à ton backend */}
            <form className="space-y-5">
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
                <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-lg py-4 rounded-xl shadow-[0_10px_20px_rgba(14,165,233,0.3)] hover:shadow-[0_15px_30px_rgba(14,165,233,0.4)] transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
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