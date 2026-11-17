"use client";
import { useState } from "react";
import { MapPin, Calendar, Users, CheckCircle2, Star, Send, ChevronRight, Palmtree, Compass, CreditCard } from "lucide-react";
import { submitBooking } from "./actions";

const dict = {
  fr: {
    about: "L'Expérience", desc: "Plongez dans un séjour d'exception pensé pour votre confort absolu. Des paysages à couper le souffle et un service premium vous attendent. Réservez dès maintenant, les places s'envolent.",
    flexible: "Dates", flexibleDesc: "Séjour planifié", spots: "Disponibilité", spotLimit: "places VIP restantes",
    price: "Tarif Exclusif", person: "/ voyageur", confirmed: "Réservation Confirmée !", ref: "Référence :",
    fname: "Prénom", lname: "Nom", phone: "Numéro de téléphone", notes: "Demandes spéciales ou allergies...",
    submit: "Confirmer ma place", loading: "Sécurisation...", noPayment: "🔒 Réservation sécurisée sans frais immédiats.",
  },
  ar: {
    about: "التجربة", desc: "انغمس في إقامة استثنائية مصممة لراحتك المطلقة. مناظر خلابة وخدمة مميزة في انتظارك. احجز الآن، الأماكن محدودة جداً.",
    flexible: "التواريخ", flexibleDesc: "إقامة مجدولة", spots: "التوفر", spotLimit: "أماكن VIP متبقية",
    price: "سعر حصري", person: "/ مسافر", confirmed: "تم تأكيد الحجز!", ref: "المرجع:",
    fname: "الاسم", lname: "اللقب", phone: "رقم الهاتف", notes: "طلبات خاصة أو حساسية...",
    submit: "تأكيد مكاني", loading: "جاري التأمين...", noPayment: "🔒 حجز آمن بدون رسوم فورية.",
  }
};

export default function OffreClient({ offer, agency }: { offer: any, agency: any }) {
  const [lang, setLang] = useState<"fr"|"ar">("fr");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{success: boolean, ref?: string}|null>(null);
  const t = dict[lang];
  const isAr = lang === "ar";
  const heroImage = offer.imageUrl || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitBooking(agency.id, offer.id, new FormData(e.currentTarget));
    setIsSubmitting(false);
    if(res.success) setResult({success: true, ref: res.ref});
  };

  return (
    <div className="bg-[#0f172a] min-h-screen text-slate-100 font-sans" dir={isAr ? "rtl" : "ltr"}>
      
      {/* HEADER HERO GÉANT (EFFET PARALLAXE) */}
      <div className="relative w-full h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Voyage" className="w-full h-full object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 mt-20 animate-in slide-in-from-bottom-10 fade-in duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-400 font-bold tracking-widest text-xs uppercase mb-6">
            <Star className="w-4 h-4 fill-emerald-400" /> Premium Collection
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white drop-shadow-2xl tracking-tight mb-4">{offer.title}</h1>
          <p className="text-xl md:text-2xl font-medium text-slate-300 drop-shadow-lg flex items-center justify-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-500" /> {offer.destination}
          </p>
        </div>

        {/* SELECTEUR DE LANGUE FLOTTANT */}
        <div className="absolute top-6 right-6 z-50 flex bg-black/30 backdrop-blur-md p-1.5 rounded-full border border-white/20 shadow-2xl">
          <button onClick={() => setLang("fr")} className={`px-4 py-2 rounded-full text-xs font-black transition-all ${lang === "fr" ? "bg-white text-slate-900" : "text-white hover:bg-white/20"}`}>FR</button>
          <button onClick={() => setLang("ar")} className={`px-4 py-2 rounded-full text-xs font-black transition-all ${lang === "ar" ? "bg-white text-slate-900" : "text-white hover:bg-white/20"}`}>عربي</button>
        </div>
      </div>

      {/* CONTENU PRINCIPAL REMONTÉ (-mt-24) POUR CHEVAUCHER L'IMAGE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-20 -mt-24 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* GAUCHE : DÉTAILS DU VOYAGE */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* CARTE AGENCE */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-[2rem] p-6 border border-slate-700/50 flex items-center justify-between shadow-2xl">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                     <Palmtree className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{agency.name}</h3>
                    <p className="text-sm text-slate-400 font-medium">Agence Certifiée</p>
                  </div>
               </div>
            </div>

            {/* DESCRIPTION */}
            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
              <h2 className="text-3xl font-black text-white mb-6 flex items-center gap-3">
                <Compass className="w-8 h-8 text-emerald-500" /> {t.about}
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg font-medium">{t.desc}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-[2rem] border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
                <Calendar className="w-10 h-10 text-emerald-400 mb-4" />
                <div className="font-black text-xl text-white mb-1">{t.flexible}</div>
                <div className="text-sm text-emerald-500/80 font-bold uppercase tracking-wider">{t.flexibleDesc}</div>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-[2rem] border border-slate-700/50 hover:border-emerald-500/50 transition-colors">
                <Users className="w-10 h-10 text-emerald-400 mb-4" />
                <div className="font-black text-xl text-white mb-1">{t.spots}</div>
                <div className="text-sm text-emerald-500/80 font-bold uppercase tracking-wider">{offer.availableSpots || "VIP"} {t.spotLimit}</div>
              </div>
            </div>
          </div>

          {/* DROITE : CARTE DE RÉSERVATION GLASSMORPHISM FLOTTANTE */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-10 bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transform hover:-translate-y-2 transition-transform duration-500">
              
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50"></div>

              <div className="mb-8">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{t.price}</div>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-black text-white">{offer.price} <span className="text-2xl text-emerald-500">DA</span></span>
                  <span className="text-slate-400 font-bold mb-2">{t.person}</span>
                </div>
              </div>

              {result?.success ? (
                <div className="text-center py-10 animate-in zoom-in">
                  <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="font-black text-2xl text-white mb-2">{t.confirmed}</h3>
                  <p className="text-slate-400 text-sm mt-2">{t.ref} <span className="font-black text-emerald-400 text-lg bg-emerald-500/10 px-3 py-1 rounded-lg ml-2">{result.ref}</span></p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in">
                  
                  <div className="space-y-4">
                    <div className="relative group">
                      <input required name="firstName" className={`w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-5 font-bold text-white outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all placeholder-slate-500 ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.fname} />
                    </div>
                    <div className="relative group">
                      <input required name="lastName" className={`w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-5 font-bold text-white outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all placeholder-slate-500 ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.lname} />
                    </div>
                    <div className="relative group">
                      <input required name="phone" className={`w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-5 font-bold text-white outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all placeholder-slate-500 ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.phone} dir="ltr" />
                    </div>
                    
                    <textarea name="notes" rows={3} className={`w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-5 font-bold text-white outline-none focus:border-emerald-500 focus:bg-slate-900 transition-all placeholder-slate-500 resize-none ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.notes} />
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="w-full relative overflow-hidden group bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black text-lg py-5 rounded-2xl mt-4 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <span className="relative z-10">{isSubmitting ? t.loading : t.submit}</span>
                    {!isSubmitting && <ChevronRight className={`w-6 h-6 relative z-10 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-2' : 'group-hover:translate-x-2'}`} />}
                  </button>
                  
                  <p className="text-center text-xs text-slate-400 mt-6 font-bold flex items-center justify-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-500" /> {t.noPayment}
                  </p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}