"use client";
import { useState } from "react";
import { MapPin, Phone, CheckCircle2, User, Send, Building2, FileText } from "lucide-react";
import { submitVisaApplication } from "./actions"; 

const dict = {
  fr: {
    title: "Demande de Visa",
    subtitle: "Renseignez vos informations pour démarrer la procédure.",
    fname: "Prénom",
    lname: "Nom",
    phone: "Numéro de téléphone",
    pass: "Numéro de Passeport",
    submit: "Confirmer la demande",
    loading: "Envoi en cours...",
    success: "Demande envoyée avec succès !",
    successSub: "Notre équipe vous contactera très rapidement pour la suite des démarches.",
    notDefined: "Non défini",
  },
  en: {
    title: "Visa Application",
    subtitle: "Fill in your details to start the procedure.",
    fname: "First Name",
    lname: "Last Name",
    phone: "Phone Number",
    pass: "Passport Number",
    submit: "Confirm Application",
    loading: "Sending...",
    success: "Application sent successfully!",
    successSub: "Our team will contact you shortly for the next steps.",
    notDefined: "Not defined",
  },
  ar: {
    title: "طلب تأشيرة",
    subtitle: "أدخل معلوماتك لبدء الإجراءات.",
    fname: "الاسم",
    lname: "اللقب",
    phone: "رقم الهاتف",
    pass: "رقم جواز السفر",
    submit: "تأكيد الطلب",
    loading: "جاري الإرسال...",
    success: "تم إرسال الطلب بنجاح!",
    successSub: "سيتصل بك فريقنا قريبًا لمتابعة الخطوات.",
    notDefined: "غير محدد",
  }
};

export default function VisaFormClient({ agency }: { agency: any }) {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = dict[lang];
  const isAr = lang === "ar";
  const logoUrl = agency?.logo || agency?.image || agency?.logoUrl;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitVisaApplication(agency.id, new FormData(e.currentTarget));
    setIsSubmitting(false);
    if (result.success) setIsSubmitted(true);
    else alert("Erreur serveur.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4" dir={isAr ? "rtl" : "ltr"}>
      
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-3xl p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/20 mb-10">
        <div className={`flex items-center gap-5 ${isAr ? 'text-right' : 'text-left'} mb-6 md:mb-0 w-full md:w-auto`}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-400 p-[2px]">
            <div className="w-full h-full bg-white rounded-[14px] overflow-hidden flex items-center justify-center">
              {logoUrl ? (
                <img src={logoUrl} alt={agency?.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-indigo-500" />
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">{agency?.name || "Safar Agency"}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {agency?.address || t.notDefined}
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> {agency?.phone || t.notDefined}
              </span>
            </div>
          </div>
        </div>

        <div className="flex bg-black/20 p-1.5 rounded-2xl shadow-inner backdrop-blur-md border border-white/10">
          {(["fr", "en", "ar"] as const).map((l) => (
             <button key={l} onClick={() => setLang(l)} className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${lang === l ? "bg-white text-indigo-900 shadow-lg scale-105" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
               {l === "fr" ? "FR" : l === "en" ? "EN" : "العربية"}
             </button>
          ))}
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white">
        {isSubmitted ? (
          <div className="flex flex-col items-center py-16 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-4">{t.success}</h2>
            <p className="text-slate-500 font-medium">{t.successSub}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-700">
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{t.title}</h2>
              <p className="text-slate-500 text-lg font-medium">{t.subtitle}</p>
            </div>
            
            <div className="bg-slate-50/80 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><User className="w-5 h-5" /></div>
                  <input required name="firstName" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-800 placeholder-slate-400 transition-all focus:ring-4 focus:ring-indigo-500/20`} placeholder={t.fname} />
                </div>
                
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><User className="w-5 h-5" /></div>
                  <input required name="lastName" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-800 placeholder-slate-400 transition-all focus:ring-4 focus:ring-indigo-500/20`} placeholder={t.lname} />
                </div>

                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><Phone className="w-5 h-5" /></div>
                  <input required name="phone" type="tel" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5' : 'pl-14 pr-5'} outline-none font-bold text-slate-800 placeholder-slate-400 transition-all focus:ring-4 focus:ring-indigo-500/20`} placeholder={t.phone} dir="ltr" />
                </div>

                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><FileText className="w-5 h-5" /></div>
                  <input required name="passport" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-800 placeholder-slate-400 transition-all focus:ring-4 focus:ring-indigo-500/20 uppercase`} placeholder={t.pass} />
                </div>

              </div>
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black text-lg py-5 rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(79,70,229,0.7)] hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,1)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
              <span className="relative z-10">{isSubmitting ? t.loading : t.submit}</span>
              {!isSubmitting && <Send className={`w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1 ${isAr ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}