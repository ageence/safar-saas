"use client";
import { useState } from "react";
import { MapPin, Calendar, Users, CheckCircle2, Star, Send } from "lucide-react";
import { submitBooking } from "./actions";

export default function OffreClient({ offer, agency }: { offer: any, agency: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{success: boolean, ref?: string}|null>(null);

  // Fallback d'image spectaculaire si l'agence n'en a pas mis
  const heroImage = offer.imageUrl || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitBooking(agency.id, offer.id, new FormData(e.currentTarget));
    setIsSubmitting(false);
    if(res.success) setResult({success: true, ref: res.ref});
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* HEADER AGENCE MINIMALISTE */}
      <header className="border-b border-slate-200 py-4 px-8 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="font-black text-2xl text-emerald-600">{agency.name}</div>
        <div className="text-sm font-bold text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4"/> {agency.address || "Agence certifiée"}</div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        
        {/* TITRE ET GALERIE FAÇON AIRBNB */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-4">{offer.title}</h1>
          <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-emerald-500 fill-emerald-500"/> Voyage Premium</span>
            <span className="underline">{offer.destination}</span>
          </div>
        </div>

        <div className="w-full h-[500px] rounded-3xl overflow-hidden mb-12">
          <img src={heroImage} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={offer.title}/>
        </div>

        {/* LAYOUT 2 COLONNES : DÉTAILS (GAUCHE) / RÉSERVATION (DROITE) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">À propos de ce voyage</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                Profitez d'un séjour exceptionnel organisé par {agency.name}. Ce package complet a été pensé pour votre confort absolu. Les places sont limitées.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-200">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
                <div><div className="font-black text-slate-900">Dates flexibles</div><div className="text-sm text-slate-500">Selon disponibilité</div></div>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-emerald-600" />
                <div><div className="font-black text-slate-900">Places restantes</div><div className="text-sm text-slate-500">{offer.availableSpots || "Limité"} spots</div></div>
              </div>
            </div>
          </div>

          {/* STICKY BOOKING CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200">
              
              <div className="mb-6 flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">{offer.price} DA</span>
                <span className="text-slate-500 font-bold mb-1">/ personne</span>
              </div>

              {result?.success ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-black text-xl text-slate-900">Demande confirmée !</h3>
                  <p className="text-slate-500 text-sm mt-2">Réf: {result.ref}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required name="firstName" className="w-full border border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="Prénom" />
                  <input required name="lastName" className="w-full border border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="Nom" />
                  <input required name="phone" className="w-full border border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20" placeholder="N° de téléphone" />
                  
                  <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2">
                    {isSubmitting ? "Envoi..." : "Réserver maintenant"}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4 font-bold">Aucun paiement requis à cette étape.</p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}