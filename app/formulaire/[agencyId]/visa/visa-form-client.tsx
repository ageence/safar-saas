"use client";

import { useState } from "react";
import { MapPin, Phone, Globe, ChevronRight, CheckCircle2, User, FileText, Send, Building2 } from "lucide-react";

// 🟢 DICTIONNAIRE MULTILINGUE INTEGRE
const dict = {
  fr: {
    apply: "Demande de Visa",
    subtitle: "Remplissez le formulaire ci-dessous pour lancer votre procédure.",
    personalInfo: "Informations Personnelles",
    firstName: "Prénom",
    lastName: "Nom",
    phone: "Numéro de téléphone",
    passport: "Numéro de Passeport",
    submit: "Envoyer ma demande",
    address: "Notre adresse",
    callUs: "Nous appeler",
    successMsg: "Votre demande a été envoyée avec succès !",
  },
  en: {
    apply: "Visa Application",
    subtitle: "Fill out the form below to start your procedure.",
    personalInfo: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    phone: "Phone Number",
    passport: "Passport Number",
    submit: "Submit Application",
    address: "Our address",
    callUs: "Call us",
    successMsg: "Your application has been successfully submitted!",
  },
  ar: {
    apply: "طلب تأشيرة",
    subtitle: "يرجى ملء النموذج أدناه لبدء الإجراءات الخاصة بك.",
    personalInfo: "المعلومات الشخصية",
    firstName: "الاسم",
    lastName: "اللقب",
    phone: "رقم الهاتف",
    passport: "رقم جواز السفر",
    submit: "إرسال الطلب",
    address: "عنواننا",
    callUs: "اتصل بنا",
    successMsg: "تم إرسال طلبك بنجاح!",
  }
};

export default function VisaFormClient({ agency }: { agency: any }) {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = dict[lang];
  const isAr = lang === "ar";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation d'envoi à l'API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" dir={isAr ? "rtl" : "ltr"}>
      
      {/* HEADER DE L'AGENCE & LANGUES */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/40 mb-10">
        
        {/* Infos Agence */}
        <div className={`flex items-center gap-5 ${isAr ? 'text-right' : 'text-left'} mb-6 md:mb-0`}>
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
            {agency.logo ? (
              <img src={agency.logo} alt="Logo" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Building2 className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{agency.name || "Agence de Voyage"}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                <MapPin className="w-4 h-4 text-indigo-500" /> {agency.address || "Adresse non définie"}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                <Phone className="w-4 h-4 text-emerald-500" /> {agency.phone || "Téléphone non défini"}
              </span>
            </div>
          </div>
        </div>

        {/* Sélecteur de Langue */}
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-inner border border-slate-200/50">
          {(["fr", "en", "ar"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                lang === l 
                  ? "bg-white text-indigo-600 shadow-sm" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
              }`}
            >
              {l === "fr" ? "FR" : l === "en" ? "EN" : "العربية"}
            </button>
          ))}
        </div>
      </div>

      {/* FORMULAIRE CENTRAL */}
      <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50">
        
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">{t.successMsg}</h2>
            <p className="text-slate-500 font-medium max-w-md">
              {agency.name} vous contactera très prochainement sur votre numéro de téléphone.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-700">
            
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight mb-4">{t.apply}</h2>
              <p className="text-slate-500 text-lg font-medium">{t.subtitle}</p>
            </div>

            <div className="space-y-6 bg-slate-50/50 p-6 md:p-8 rounded-[2rem] border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><User className="w-5 h-5" /></div>
                <h3 className="text-xl font-bold text-slate-800">{t.personalInfo}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inputs avec design flottant et focus premium */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t.firstName}</label>
                  <input required type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.firstName} />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t.lastName}</label>
                  <input required type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 ${isAr ? 'text-right' : 'text-left'}`} placeholder={t.lastName} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t.phone}</label>
                  <input required type="tel" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800 placeholder-slate-400 ${isAr ? 'text-right' : 'text-left'}`} placeholder="+213 XXX XX XX XX" dir="ltr" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">{t.passport}</label>
                  <input required type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-5 py-4 outline-none transition-all font-medium text-slate-800 uppercase placeholder-slate-400 ${isAr ? 'text-right' : 'text-left'}`} placeholder="Ex: 123456789" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full relative group bg-slate-900 hover:bg-indigo-600 text-white font-black text-lg py-5 rounded-[1.5rem] shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 overflow-hidden flex items-center justify-center gap-3">
              <span className="relative z-10">{isSubmitting ? "..." : t.submit}</span>
              {!isSubmitting && <Send className={`w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />}
            </button>
            
          </form>
        )}
      </div>

    </div>
  );
}