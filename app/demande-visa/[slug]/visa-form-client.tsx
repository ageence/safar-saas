"use client";
import { useState, useRef } from "react";
import { CheckCircle2, Send, UploadCloud, X, ArrowRight, ArrowLeft, ShieldCheck, FileImage, Briefcase, Globe2 } from "lucide-react";
import { submitVisaApplication } from "./actions";

const dict = {
  fr: {
    title: "Dossier Visa Premium", subtitle: "Traitement rapide et sécurisé",
    step1: "Identité", step2: "Profil", step3: "Documents", step4: "Confirmation",
    fname: "Prénom", lname: "Nom", phone: "Téléphone", pass: "N° Passeport", country: "Pays de destination",
    notes: "Vos remarques (Optionnel)",
    prof: "Votre Situation Professionnelle",
    profList: ["Étudiant", "Employé", "Indépendant", "Retraité", "Sans emploi"],
    history: "Historique de Visa (Pour ce pays)",
    histList: ["Jamais demandé (Première fois)", "Visa déjà obtenu dans le passé", "Visa refusé précédemment"],
    uploadPhoto: "Photo d'identité", uploadPass: "Copie du Passeport", dragDrop: "Glissez ou cliquez",
    sizeRule: "Max 5MB", remove: "Retirer", next: "Suivant", prev: "Retour", submit: "Transmettre le dossier",
    success: "Dossier Transmis !", successSub: "Réf. de suivi :",
  },
  ar: {
    title: "ملف التأشيرة المتميز", subtitle: "معالجة سريعة وآمنة",
    step1: "الهوية", step2: "الملف الشخصي", step3: "الوثائق", step4: "تأكيد",
    fname: "الاسم", lname: "اللقب", phone: "الهاتف", pass: "رقم الجواز", country: "بلد الوجهة",
    notes: "ملاحظات (اختياري)",
    prof: "الوضع المهني الحالي",
    profList: ["طالب", "موظف", "عمل حر", "متقاعد", "بدون عمل"],
    history: "تاريخ التأشيرات (لهذا البلد)",
    histList: ["أول مرة (لم يسبق لي الطلب)", "سبق لي الحصول على تأشيرة", "تم رفض طلبي سابقاً"],
    uploadPhoto: "صورة شمسية", uploadPass: "نسخة الجواز", dragDrop: "اسحب أو اضغط",
    sizeRule: "الحد الأقصى 5MB", remove: "حذف", next: "التالي", prev: "رجوع", submit: "إرسال الملف",
    success: "تم إرسال الملف!", successSub: "مرجع التتبع:",
  }
};

export default function VisaFormClient({ agency, visaOffer }: { agency: any, visaOffer: any }) {
  const [lang, setLang] = useState<"fr"|"ar">("fr");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{success: boolean, ref?: string}|null>(null);
  
  const [occupation, setOccupation] = useState("");
  const [visaHistory, setVisaHistory] = useState("");
  const [photo, setPhoto] = useState<{file: File, preview: string}|null>(null);
  const [passportDoc, setPassportDoc] = useState<{file: File, preview: string}|null>(null);
  
  const photoRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const t = dict[lang];
  const isAr = lang === "ar";

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, type: "photo"|"pass") => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      type === "photo" ? setPhoto({file, preview}) : setPassportDoc({file, preview});
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Bloquants d'étapes
    if (step === 2 && (!occupation || !visaHistory)) return alert(isAr ? "يرجى اختيار المهنة والتاريخ" : "Veuillez sélectionner votre situation et historique.");
    if (step < 4) return setStep(step + 1);
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.append("occupation", occupation);
    formData.append("visaHistory", visaHistory);
    if (photo) formData.append("photoName", photo.file.name);
    if (passportDoc) formData.append("passName", passportDoc.file.name);
    
    const res = await submitVisaApplication(agency.id, visaOffer.id, formData);
    setIsSubmitting(false);
    if (res.success) setResult({ success: true, ref: res.ref });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20" dir={isAr ? "rtl" : "ltr"}>
      
      {/* HEADER AGENCE (Même style que voyage) */}
      <div className="flex justify-between items-center mb-10 mt-6">
        <div className="bg-white px-6 py-3 rounded-full shadow-lg border border-slate-200 font-black text-indigo-900 text-xl flex items-center gap-3">
          <Globe2 className="w-6 h-6 text-indigo-500" /> {agency.name}
        </div>
        <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-full font-bold transition-all shadow-inner">
          {lang === "fr" ? "العربية" : "Français"}
        </button>
      </div>

      <div className="bg-white rounded-[3rem] p-8 md:p-14 shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
        
        {/* LIGNE DE DÉCO */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 to-indigo-600"></div>

        {result?.success ? (
          <div className="text-center py-16 animate-in zoom-in">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-2">{t.success}</h2>
            <p className="text-slate-500 font-bold mb-6">{t.successSub} <span className="text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl text-xl ml-2">{result.ref}</span></p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">{t.title}</h2>
              <p className="text-slate-500 mt-2 font-medium">{t.subtitle}</p>
            </div>

            {/* PROGRESS BAR (4 Etapes) */}
            <div className="flex justify-between relative mb-12 max-w-lg mx-auto">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-500" style={{width: `${((step-1)/3)*100}%`}}></div>
              {[1,2,3,4].map(i => (
                <div key={i} className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all ${step >= i ? "bg-indigo-600 text-white shadow-xl scale-110" : "bg-white border-[3px] border-slate-200 text-slate-400"}`}>{i}</div>
              ))}
            </div>

            {/* ETAPE 1: IDENTITE */}
            <div className={`space-y-6 animate-in fade-in slide-in-from-right-10 duration-500 ${step === 1 ? 'block' : 'hidden'}`}>
              <div className="grid md:grid-cols-2 gap-6">
                <input required={step===1} name="firstName" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-5 font-bold outline-none shadow-inner" placeholder={t.fname} />
                <input required={step===1} name="lastName" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-5 font-bold outline-none shadow-inner" placeholder={t.lname} />
                <input required={step===1} name="phone" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-5 font-bold outline-none shadow-inner" placeholder={t.phone} dir="ltr" />
                <input required={step===1} name="passport" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-5 font-bold outline-none shadow-inner uppercase" placeholder={t.pass} />
                <div className="md:col-span-2">
                  <textarea name="notes" rows={3} className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-5 font-bold outline-none shadow-inner resize-none" placeholder={t.notes} />
                </div>
              </div>
            </div>

            {/* 🟢 ETAPE 2: PROFIL (NOUVEAU) 🟢 */}
            <div className={`space-y-10 animate-in fade-in slide-in-from-right-10 duration-500 ${step === 2 ? 'block' : 'hidden'}`}>
              
              <div>
                <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2"><Briefcase className="w-6 h-6 text-indigo-500"/> {t.prof}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {t.profList.map(prof => (
                    <button type="button" key={prof} onClick={() => setOccupation(prof)} className={`p-4 rounded-2xl border-2 font-bold transition-all text-sm ${occupation === prof ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"}`}>
                      {prof}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2"><Globe2 className="w-6 h-6 text-indigo-500"/> {t.history}</h3>
                <div className="flex flex-col gap-3">
                  {t.histList.map((hist, idx) => (
                    <button type="button" key={idx} onClick={() => setVisaHistory(hist)} className={`p-5 rounded-2xl border-2 font-bold transition-all text-left flex items-center gap-4 ${isAr ? 'text-right' : ''} ${visaHistory === hist ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md" : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300"}`}>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${visaHistory === hist ? 'border-indigo-600' : 'border-slate-300'}`}>
                        {visaHistory === hist && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                      </div>
                      {hist}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* ETAPE 3: UPLOAD */}
            <div className={`space-y-6 animate-in fade-in slide-in-from-right-10 duration-500 ${step === 3 ? 'block' : 'hidden'}`}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2rem] p-8 text-center hover:border-indigo-500 transition-colors group">
                  <input type="file" ref={photoRef} onChange={(e) => handleFile(e, "photo")} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {photo ? (
                    <div className="relative z-10 flex flex-col items-center">
                      <img src={photo.preview} className="w-32 h-32 object-cover rounded-2xl shadow-xl border-4 border-white mb-4" alt="preview"/>
                      <button type="button" onClick={() => {setPhoto(null); if(photoRef.current) photoRef.current.value = "";}} className="bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-bold z-30 relative hover:bg-rose-200">{t.remove}</button>
                    </div>
                  ) : (
                    <div className="relative z-10 pointer-events-none">
                      <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-lg font-black text-slate-700">{t.uploadPhoto}</h3>
                      <p className="text-slate-400 text-sm mt-1">{t.dragDrop}</p>
                    </div>
                  )}
                </div>

                <div className="relative overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 rounded-[2rem] p-8 text-center hover:border-indigo-500 transition-colors group">
                  <input type="file" ref={passRef} onChange={(e) => handleFile(e, "pass")} accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  {passportDoc ? (
                    <div className="relative z-10 flex flex-col items-center">
                      <img src={passportDoc.preview} className="w-48 h-32 object-cover rounded-2xl shadow-xl border-4 border-white mb-4" alt="preview"/>
                      <button type="button" onClick={() => {setPassportDoc(null); if(passRef.current) passRef.current.value = "";}} className="bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-bold z-30 relative hover:bg-rose-200">{t.remove}</button>
                    </div>
                  ) : (
                    <div className="relative z-10 pointer-events-none">
                      <FileImage className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                      <h3 className="text-lg font-black text-slate-700">{t.uploadPass}</h3>
                      <p className="text-slate-400 text-sm mt-1">{t.dragDrop}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ETAPE 4: RECAPITULATIF */}
            <div className={`animate-in fade-in slide-in-from-right-10 duration-500 ${step === 4 ? 'block' : 'hidden'}`}>
              <div className="bg-indigo-50 border-2 border-indigo-100 p-8 rounded-[2rem] text-center">
                <ShieldCheck className="w-20 h-20 text-indigo-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-800 mb-2">Dossier Complet</h3>
                <p className="text-slate-600 font-medium">Vos informations, votre profil et vos documents sont prêts à être transmis de manière sécurisée à notre équipe.</p>
                <input type="hidden" name="country" value={visaOffer.country || "Non défini"} />
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex gap-4 pt-6 border-t border-slate-100 mt-10">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step-1)} className="px-8 py-5 rounded-2xl bg-slate-100 font-black text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2">
                  <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                </button>
              )}
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 transition-all hover:-translate-y-1">
                {isSubmitting ? t.loading : step < 4 ? t.next : t.submit} 
                {!isSubmitting && (step < 4 ? <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`}/> : <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`}/>)}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}