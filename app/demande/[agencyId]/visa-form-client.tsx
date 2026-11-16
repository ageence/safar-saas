"use client";
import { useState } from "react";
import { MapPin, Phone, CheckCircle2, User, Send, Building2 } from "lucide-react";
import { submitVisaApplication } from "./actions";

export default function VisaFormClient({ agency }: { agency: any }) {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAr = lang === "ar";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitVisaApplication(agency.id, new FormData(e.currentTarget));
    setIsSubmitting(false);
    if (result.success) setIsSubmitted(true);
    else alert("Erreur serveur.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-xl border border-white/40 mb-10">
        <div className={`flex items-center gap-5 ${isAr ? 'text-right' : 'text-left'} mb-6 md:mb-0`}>
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg"><Building2 className="w-8 h-8 text-white" /></div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">{agency.name}</h1>
            <div className="flex gap-4 mt-2 text-sm text-slate-500">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-indigo-500" /> {agency.address || "Adresse non définie"}</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-emerald-500" /> {agency.phone || "Téléphone non défini"}</span>
            </div>
          </div>
        </div>
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl shadow-inner">
          {(["fr", "en", "ar"] as const).map((l) => (
             <button key={l} onClick={() => setLang(l)} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${lang === l ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}>{l.toUpperCase()}</button>
          ))}
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/50">
        {isSubmitted ? (
          <div className="flex flex-col items-center py-20 text-center animate-in zoom-in">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
            <h2 className="text-3xl font-black text-slate-800">Demande envoyée !</h2>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in">
            <div className="text-center max-w-2xl mx-auto"><h2 className="text-4xl font-black text-slate-800">Demande de Visa</h2></div>
            <div className="space-y-6 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required name="firstName" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl px-5 py-4 ${isAr ? 'text-right' : 'text-left'}`} placeholder="Prénom" />
                <input required name="lastName" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl px-5 py-4 ${isAr ? 'text-right' : 'text-left'}`} placeholder="Nom" />
                <input required name="phone" type="tel" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl px-5 py-4 ${isAr ? 'text-right' : 'text-left'}`} placeholder="+213 XXX XX XX XX" dir="ltr" />
                <input required name="passport" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl px-5 py-4 ${isAr ? 'text-right' : 'text-left'}`} placeholder="Passeport" />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-xl hover:bg-indigo-600 transition-all flex justify-center gap-3">
              {isSubmitting ? "Chargement..." : "Envoyer ma demande"} <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}