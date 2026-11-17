"use client";
import { useState, useRef } from "react";
import { MapPin, Phone, CheckCircle2, User, Send, FileText, Globe, UploadCloud, X, ArrowRight, ArrowLeft, ShieldCheck, FileImage } from "lucide-react";
import { submitVisaApplication } from "./actions";

const dict = {
  fr: {
    title: "Dossier Visa", subtitle: "Préparation et soumission sécurisée",
    step1: "Identité", step2: "Documents", step3: "Vérification",
    fname: "Prénom", lname: "Nom", phone: "Téléphone", pass: "N° Passeport", country: "Pays de destination",
    notes: "Vos remarques supplémentaires (Optionnel)...",
    uploadPhoto: "Photo d'identité", uploadPass: "Copie du Passeport", dragDrop: "Glissez le fichier ou cliquez",
    sizeRule: "PNG, JPG jusqu'à 5MB", fileReady: "Prêt à l'envoi", remove: "Retirer",
    next: "Continuer", prev: "Retour", submit: "Soumettre le dossier", loading: "Analyse en cours...",
    success: "Dossier Transmis !", successSub: "Référence de suivi :",
  },
  en: {
    title: "Visa Application", subtitle: "Secure preparation and submission",
    step1: "Identity", step2: "Documents", step3: "Verification",
    fname: "First Name", lname: "Last Name", phone: "Phone", pass: "Passport No.", country: "Destination Country",
    notes: "Additional remarks (Optional)...",
    uploadPhoto: "Passport Photo", uploadPass: "Passport Copy", dragDrop: "Drag file or click",
    sizeRule: "PNG, JPG up to 5MB", fileReady: "Ready to send", remove: "Remove",
    next: "Continue", prev: "Back", submit: "Submit Application", loading: "Processing...",
    success: "Application Submitted!", successSub: "Tracking Reference:",
  },
  ar: {
    title: "ملف التأشيرة", subtitle: "إعداد وتقديم آمن",
    step1: "الهوية", step2: "الوثائق", step3: "المراجعة",
    fname: "الاسم", lname: "اللقب", phone: "الهاتف", pass: "رقم الجواز", country: "بلد الوجهة",
    notes: "ملاحظات إضافية (اختياري)...",
    uploadPhoto: "صورة شمسية", uploadPass: "نسخة الجواز", dragDrop: "اسحب الملف أو اضغط",
    sizeRule: "PNG, JPG حتى 5MB", fileReady: "جاهز للإرسال", remove: "حذف",
    next: "متابعة", prev: "رجوع", submit: "إرسال الملف", loading: "جاري التحليل...",
    success: "تم إرسال الملف!", successSub: "رقم التتبع الخاص بك:",
  }
};

export default function VisaFormClient({ agency, visaOffer }: { agency: any, visaOffer: any }) {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean, ref?: string } | null>(null);
  
  // States des fichiers
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
    if (step < 3) return setStep(step + 1);
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    // On simule l'envoi des noms de fichiers pour la BDD
    if (photo) formData.append("photoName", photo.file.name);
    if (passportDoc) formData.append("passName", passportDoc.file.name);
    
    const res = await submitVisaApplication(agency.id, visaOffer.id, formData);
    setIsSubmitting(false);
    if (res.success) setResult({ success: true, ref: res.ref });
  };

  return (
    <div className="max-w-4xl mx-auto px-4" dir={isAr ? "rtl" : "ltr"}>
      
      {/* HEADER AGENCE */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-2xl p-5 rounded-[2rem] border border-white/10 mb-8 shadow-xl">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-lg flex items-center justify-center font-black text-indigo-900 text-xl">
            {agency.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-black text-white">{agency.name}</h1>
            <p className="text-slate-300 text-sm">{visaOffer.title}</p>
          </div>
        </div>
        
        {/* SELECTEUR DE LANGUES MULTIPLE */}
        <div className="flex bg-white/10 p-1.5 rounded-2xl shadow-inner border border-white/20">
          {(["fr", "en", "ar"] as const).map((l) => (
             <button 
               key={l} 
               onClick={() => setLang(l)} 
               className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                 lang === l 
                   ? "bg-white text-indigo-900 shadow-md" 
                   : "text-white/70 hover:text-white hover:bg-white/20"
               }`}
             >
               {l === "fr" ? "FR" : l === "en" ? "EN" : "العربية"}
             </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100">
        {result?.success ? (
          <div className="text-center py-16 animate-in zoom-in">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-slate-800 mb-2">{t.success}</h2>
            <p className="text-slate-500 font-bold mb-6">{t.successSub} <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{result.ref}</span></p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800">{t.title}</h2>
              <p className="text-slate-500">{t.subtitle}</p>
            </div>

            {/* PROGRESS BAR */}
            <div className="flex justify-between relative mb-12 max-w-md mx-auto">
              <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 transition-all duration-500" style={{width: `${((step-1)/2)*100}%`}}></div>
              {[1,2,3].map(i => (
                <div key={i} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= i ? "bg-indigo-600 text-white shadow-lg" : "bg-white border-2 border-slate-200 text-slate-400"}`}>{i}</div>
              ))}
            </div>

            {/* ETAPE 1: IDENTITE */}
            <div className={`space-y-6 animate-in fade-in duration-500 ${step === 1 ? 'block' : 'hidden'}`}>
              <div className="grid md:grid-cols-2 gap-6">
                <input required={step===1} name="firstName" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-4 font-bold outline-none" placeholder={t.fname} />
                <input required={step===1} name="lastName" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-4 font-bold outline-none" placeholder={t.lname} />
                <input required={step===1} name="phone" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-4 font-bold outline-none" placeholder={t.phone} dir="ltr" />
                <input required={step===1} name="passport" className="w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-4 font-bold outline-none" placeholder={t.pass} />
                
                {/* 🟢 CHAMP NOTES AJOUTÉ ICI (Prend toute la largeur) */}
                <div className="md:col-span-2 relative mt-2">
                  <textarea 
                    name="notes" 
                    rows={3}
                    className={`w-full bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 rounded-2xl p-4 font-bold outline-none resize-none transition-colors ${isAr ? 'text-right' : 'text-left'}`} 
                    placeholder={t.notes} 
                  />
                </div>
              </div>
            </div>

            {/* ETAPE 2: UPLOAD */}
            <div className={`space-y-6 animate-in fade-in duration-500 ${step === 2 ? 'block' : 'hidden'}`}>
              {/* Photo Upload Dropzone */}
              <div className="relative overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:border-indigo-500 transition-colors group">
                <input type="file" ref={photoRef} onChange={(e) => handleFile(e, "photo")} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {photo ? (
                  <div className="relative z-10 flex flex-col items-center">
                    <img src={photo.preview} className="w-32 h-32 object-cover rounded-2xl shadow-md border-4 border-white mb-4" alt="preview"/>
                    <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {t.fileReady}</div>
                    <button type="button" onClick={() => {setPhoto(null); if(photoRef.current) photoRef.current.value = "";}} className="text-rose-500 text-sm font-bold z-30 relative underline hover:text-rose-600">{t.remove}</button>
                  </div>
                ) : (
                  <div className="relative z-10 pointer-events-none">
                    <UploadCloud className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-black text-slate-700">{t.uploadPhoto}</h3>
                    <p className="text-slate-500">{t.dragDrop}</p>
                    <p className="text-xs text-slate-400 mt-2">{t.sizeRule}</p>
                  </div>
                )}
              </div>

              {/* Passeport Upload Dropzone */}
              <div className="relative overflow-hidden bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:border-indigo-500 transition-colors group">
                <input type="file" ref={passRef} onChange={(e) => handleFile(e, "pass")} accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                {passportDoc ? (
                  <div className="relative z-10 flex flex-col items-center">
                    <img src={passportDoc.preview} className="w-48 h-32 object-cover rounded-2xl shadow-md border-4 border-white mb-4" alt="preview"/>
                    <div className="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-sm font-bold mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4"/> {t.fileReady}</div>
                    <button type="button" onClick={() => {setPassportDoc(null); if(passRef.current) passRef.current.value = "";}} className="text-rose-500 text-sm font-bold z-30 relative underline hover:text-rose-600">{t.remove}</button>
                  </div>
                ) : (
                  <div className="relative z-10 pointer-events-none">
                    <FileImage className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-black text-slate-700">{t.uploadPass}</h3>
                    <p className="text-slate-500">{t.dragDrop}</p>
                    <p className="text-xs text-slate-400 mt-2">{t.sizeRule}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ETAPE 3: RECAPITULATIF */}
            <div className={`space-y-6 animate-in fade-in duration-500 ${step === 3 ? 'block' : 'hidden'}`}>
              <div className="bg-indigo-50 p-6 rounded-3xl text-center">
                <ShieldCheck className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-slate-800 mb-2">{t.step3}</h3>
                <p className="text-slate-600">Vos informations et documents sont prêts à être transmis à l'agence de manière sécurisée.</p>
                <input type="hidden" name="country" value={visaOffer.country || "Non défini"} />
              </div>
            </div>

            {/* NAVIGATION */}
            <div className="flex gap-4 pt-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step-1)} className="px-6 py-4 rounded-2xl bg-slate-100 font-black text-slate-600 hover:bg-slate-200 w-1/3 transition-colors">
                  {t.prev}
                </button>
              )}
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all">
                {isSubmitting ? t.loading : step < 3 ? t.next : t.submit} 
                {!isSubmitting && (step < 3 ? <ArrowRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`}/> : <Send className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`}/>)}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}