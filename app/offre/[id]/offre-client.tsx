"use client";
import { useState } from "react";
import { MapPin, Calendar, Users, CheckCircle2, Star, Send } from "lucide-react";
import { submitBooking } from "./actions";

// Dictionnaire pour la traduction de la réservation
const dict = {
  fr: {
    about: "À propos de ce voyage",
    desc: "Profitez d'un séjour exceptionnel. Ce package complet a été pensé pour votre confort absolu. Les places sont limitées.",
    flexible: "Dates flexibles",
    flexibleDesc: "Selon disponibilité",
    spots: "Places restantes",
    spotLimit: "places",
    price: "Tarif",
    person: "/ personne",
    confirmed: "Demande confirmée !",
    ref: "Réf :",
    fname: "Prénom",
    lname: "Nom",
    phone: "N° de téléphone",
    notes: "Vos remarques ou notes additionnelles (Optionnel)...",
    submit: "Réserver maintenant",
    loading: "Envoi...",
    noPayment: "Aucun paiement requis à cette étape.",
    premium: "Voyage Premium"
  },
  en: {
    about: "About this trip",
    desc: "Enjoy an exceptional stay. This complete package has been designed for your absolute comfort. Seats are limited.",
    flexible: "Flexible Dates",
    flexibleDesc: "Subject to availability",
    spots: "Remaining spots",
    spotLimit: "spots",
    price: "Price",
    person: "/ person",
    confirmed: "Request Confirmed!",
    ref: "Ref:",
    fname: "First Name",
    lname: "Last Name",
    phone: "Phone Number",
    notes: "Your remarks or additional notes (Optional)...",
    submit: "Book Now",
    loading: "Sending...",
    noPayment: "No payment required at this stage.",
    premium: "Premium Trip"
  },
  ar: {
    about: "حول هذه الرحلة",
    desc: "استمتع بإقامة استثنائية. تم تصميم هذه الباقة الكاملة لراحتك المطلقة. الأماكن محدودة.",
    flexible: "تواريخ مرنة",
    flexibleDesc: "حسب التوفر",
    spots: "الأماكن المتبقية",
    spotLimit: "أماكن",
    price: "السعر",
    person: "/ للشخص",
    confirmed: "تم تأكيد الطلب!",
    ref: "رقم المرجع:",
    fname: "الاسم",
    lname: "اللقب",
    phone: "رقم الهاتف",
    notes: "ملاحظات إضافية (اختياري)...",
    submit: "احجز الآن",
    loading: "جاري الإرسال...",
    noPayment: "لا حاجة للدفع في هذه المرحلة.",
    premium: "رحلة مميزة"
  }
};

export default function OffreClient({ offer, agency }: { offer: any, agency: any }) {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{success: boolean, ref?: string}|null>(null);

  const t = dict[lang];
  const isAr = lang === "ar";

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
    <div className="bg-white min-h-screen pb-20" dir={isAr ? "rtl" : "ltr"}>
      
      {/* HEADER AGENCE MINIMALISTE */}
      <header className="border-b border-slate-200 py-4 px-8 flex justify-between items-center bg-white sticky top-0 z-50">
        <div className="font-black text-2xl text-emerald-600">{agency.name}</div>
        
        <div className="flex items-center gap-6">
          <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
            <MapPin className="w-4 h-4"/> {agency.address || (isAr ? "وكالة معتمدة" : "Agence certifiée")}
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
            {(["fr", "en", "ar"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${
                  lang === l 
                    ? "bg-white text-emerald-600 shadow-sm" 
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                }`}
              >
                {l === "fr" ? "FR" : l === "en" ? "EN" : "عربي"}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        
        {/* TITRE ET GALERIE FAÇON AIRBNB */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 mb-4">{offer.title}</h1>
          <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
            <span className="flex items-center gap-1"><Star className="w-4 h-4 text-emerald-500 fill-emerald-500"/> {t.premium}</span>
            <span className="underline">{offer.destination}</span>
          </div>
        </div>

        <div className="w-full h-[500px] rounded-3xl overflow-hidden mb-12 shadow-xl">
          <img src={heroImage} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" alt={offer.title}/>
        </div>

        {/* LAYOUT 2 COLONNES : DÉTAILS (GAUCHE) / RÉSERVATION (DROITE) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative">
          
          <div className="lg:col-span-2 space-y-10">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">{t.about}</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {t.desc}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 py-8 border-y border-slate-200">
              <div className="flex items-center gap-4">
                <Calendar className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="font-black text-slate-900">{t.flexible}</div>
                  <div className="text-sm text-slate-500">{t.flexibleDesc}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Users className="w-8 h-8 text-emerald-600" />
                <div>
                  <div className="font-black text-slate-900">{t.spots}</div>
                  <div className="text-sm text-slate-500">{offer.availableSpots || "Limité"} {t.spotLimit}</div>
                </div>
              </div>
            </div>
          </div>

          {/* STICKY BOOKING CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200">
              
              <div className="mb-6 flex items-end gap-2">
                <span className="text-3xl font-black text-slate-900">{offer.price} DA</span>
                <span className="text-slate-500 font-bold mb-1">{t.person}</span>
              </div>

              {result?.success ? (
                <div className="text-center py-8 animate-in zoom-in">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-black text-xl text-slate-900">{t.confirmed}</h3>
                  <p className="text-slate-500 text-sm mt-2">{t.ref} <span className="font-bold text-emerald-600">{result.ref}</span></p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in">
                  <input required name="firstName" className={`w-full border border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.fname} />
                  
                  <input required name="lastName" className={`w-full border border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.lname} />
                  
                  <input required name="phone" className={`w-full border border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.phone} dir="ltr" />
                  
                  {/* 🟢 CHAMP NOTES RESTAURÉ */}
                  <textarea 
                    name="notes" 
                    rows={3}
                    className={`w-full border border-slate-300 rounded-xl p-4 font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 ${isAr ? 'text-right' : 'text-left'}`} 
                    placeholder={t.notes} 
                  />
                  
                  <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-xl mt-4 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:-translate-y-0.5">
                    {isSubmitting ? t.loading : t.submit}
                    {!isSubmitting && <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />}
                  </button>
                  
                  <p className="text-center text-xs text-slate-500 mt-4 font-bold">{t.noPayment}</p>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}