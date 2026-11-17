"use client";
import { useState, useRef } from "react";
import { MapPin, Phone, CheckCircle2, User, Send, Building2, FileText, Globe, Plane, Calendar, UploadCloud, Image as ImageIcon, X, ArrowRight, ArrowLeft } from "lucide-react";
import { submitVisaApplication } from "./actions";

// 🟢 LE DICTIONNAIRE ABSOLU (100% TRADUIT)
const dict = {
  fr: {
    title: "Dossier Visa Premium",
    subtitle: "Préparez votre dossier en quelques clics.",
    step1: "Informations",
    step2: "Voyage",
    step3: "Documents",
    fname: "Prénom",
    lname: "Nom",
    phone: "Numéro de téléphone",
    pass: "Numéro de Passeport",
    destination: "Pays de destination",
    visaType: "Type de Visa (ex: Tourisme, Étude)",
    travelDate: "Date de départ prévue",
    uploadPhoto: "Photo d'identité",
    uploadPass: "Copie du Passeport",
    dragDrop: "Cliquez ou glissez le fichier ici",
    fileSelected: "Fichier sélectionné :",
    removeFile: "Supprimer",
    next: "Suivant",
    prev: "Retour",
    submit: "Soumettre mon dossier",
    loading: "Création du dossier...",
    success: "Dossier soumis avec succès !",
    successSub: "Votre numéro de suivi est :",
    successDesc: "Connectez-vous à votre espace pour suivre l'avancement en temps réel.",
    notDefined: "Non défini",
  },
  en: {
    title: "Premium Visa File",
    subtitle: "Prepare your application in a few clicks.",
    step1: "Information",
    step2: "Travel",
    step3: "Documents",
    fname: "First Name",
    lname: "Last Name",
    phone: "Phone Number",
    pass: "Passport Number",
    destination: "Destination Country",
    visaType: "Visa Type (e.g. Tourist, Student)",
    travelDate: "Expected Departure Date",
    uploadPhoto: "Passport Photo",
    uploadPass: "Passport Copy",
    dragDrop: "Click or drag file here",
    fileSelected: "File selected:",
    removeFile: "Remove",
    next: "Next",
    prev: "Back",
    submit: "Submit Application",
    loading: "Creating file...",
    success: "Application submitted successfully!",
    successSub: "Your tracking reference is:",
    successDesc: "Log in to your space to track progress in real-time.",
    notDefined: "Not defined",
  },
  ar: {
    title: "ملف التأشيرة المميز",
    subtitle: "جهز ملفك في بضع خطوات.",
    step1: "المعلومات",
    step2: "الرحلة",
    step3: "الوثائق",
    fname: "الاسم",
    lname: "اللقب",
    phone: "رقم الهاتف",
    pass: "رقم جواز السفر",
    destination: "بلد الوجهة",
    visaType: "نوع التأشيرة (سياحة، دراسة...)",
    travelDate: "تاريخ المغادرة المتوقع",
    uploadPhoto: "صورة شمسية",
    uploadPass: "نسخة من جواز السفر",
    dragDrop: "اضغط أو اسحب الملف هنا",
    fileSelected: "الملف المحدد:",
    removeFile: "حذف",
    next: "التالي",
    prev: "رجوع",
    submit: "تقديم الملف",
    loading: "جاري إنشاء الملف...",
    success: "تم تقديم الملف بنجاح!",
    successSub: "رقم التتبع الخاص بك هو:",
    successDesc: "سجل الدخول إلى مساحتك لمتابعة تقدم الملف في الوقت الفعلي.",
    notDefined: "غير محدد",
  }
};

export default function VisaFormClient({ agency }: { agency: any }) {
  const [lang, setLang] = useState<"fr" | "en" | "ar">("fr");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ success: boolean, ref?: string } | null>(null);
  
  // 🟢 GESTION DES FICHIERS ET APERÇUS (LIVE PREVIEW)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [passPreview, setPassPreview] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const passInputRef = useRef<HTMLInputElement>(null);
  
  const t = dict[lang];
  const isAr = lang === "ar";
  const logoUrl = agency?.logo || agency?.image || agency?.logoUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "photo" | "pass") => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (type === "photo") setPhotoPreview(previewUrl);
      if (type === "pass") setPassPreview(previewUrl);
    }
  };

  const removeFile = (type: "photo" | "pass") => {
    if (type === "photo") {
      setPhotoPreview(null);
      if (photoInputRef.current) photoInputRef.current.value = "";
    } else {
      setPassPreview(null);
      if (passInputRef.current) passInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitVisaApplication(agency.id, formData);
    setIsSubmitting(false);
    
    if (result.success) {
      setSubmittedData({ success: true, ref: result.reference });
    } else {
      alert("Erreur serveur.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4" dir={isAr ? "rtl" : "ltr"}>
      
      {/* HEADER AGENCE LUXE */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 backdrop-blur-3xl p-4 md:p-6 rounded-[2rem] shadow-2xl border border-white/20 mb-10">
        <div className={`flex items-center gap-5 ${isAr ? 'text-right' : 'text-left'} mb-6 md:mb-0 w-full md:w-auto`}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-400 p-[2px]">
            <div className="w-full h-full bg-white rounded-[14px] overflow-hidden flex items-center justify-center">
              {logoUrl ? <img src={logoUrl} alt={agency?.name} className="w-full h-full object-cover" /> : <Building2 className="w-8 h-8 text-indigo-500" />}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight drop-shadow-md">{agency?.name || "Safar Agency"}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-xs font-bold text-slate-200">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {agency?.address || t.notDefined}
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

      {/* FORMULAIRE MULTI-ÉTAPES */}
      <div className="bg-white/95 backdrop-blur-3xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white">
        
        {submittedData?.success ? (
          <div className="flex flex-col items-center py-16 text-center animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">{t.success}</h2>
            <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 mb-6">
               <p className="text-slate-500 font-bold mb-2">{t.successSub}</p>
               <p className="text-3xl font-black text-indigo-600 tracking-widest">{submittedData.ref}</p>
            </div>
            <p className="text-slate-500 font-medium max-w-md">{t.successDesc}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="animate-in fade-in duration-700">
            
            <div className="text-center max-w-xl mx-auto mb-10">
              <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">{t.title}</h2>
              <p className="text-slate-500 text-lg font-medium">{t.subtitle}</p>
            </div>

            {/* PROGRESS BAR */}
            <div className="flex justify-between items-center mb-10 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full z-0"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
              
              {[1, 2, 3].map((num) => (
                <div key={num} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 ${step >= num ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110" : "bg-white border-2 border-slate-200 text-slate-400"}`}>
                    {num}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${step >= num ? "text-indigo-600" : "text-slate-400"}`}>
                    {num === 1 ? t.step1 : num === 2 ? t.step2 : t.step3}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="bg-slate-50/80 p-8 rounded-[2rem] border border-slate-100 shadow-inner mb-8 overflow-hidden">
              
              {/* ÉTAPE 1 : INFOS PERSONNELLES */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ${step === 1 ? "block opacity-100" : "hidden opacity-0"}`}>
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><User className="w-5 h-5" /></div>
                  <input required={step === 1} name="firstName" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-800 placeholder-slate-400`} placeholder={t.fname} />
                </div>
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><User className="w-5 h-5" /></div>
                  <input required={step === 1} name="lastName" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-800 placeholder-slate-400`} placeholder={t.lname} />
                </div>
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><Phone className="w-5 h-5" /></div>
                  <input required={step === 1} name="phone" type="tel" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5' : 'pl-14 pr-5'} outline-none font-bold text-slate-800 placeholder-slate-400`} placeholder={t.phone} dir="ltr" />
                </div>
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><FileText className="w-5 h-5" /></div>
                  <input required={step === 1} name="passport" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-800 placeholder-slate-400 uppercase`} placeholder={t.pass} />
                </div>
              </div>

              {/* ÉTAPE 2 : DÉTAILS VOYAGE */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500 ${step === 2 ? "block opacity-100" : "hidden opacity-0"}`}>
                <div className="relative md:col-span-2">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><Globe className="w-5 h-5" /></div>
                  <input required={step === 2} name="destination" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-800 placeholder-slate-400`} placeholder={t.destination} />
                </div>
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><Plane className="w-5 h-5" /></div>
                  <input required={step === 2} name="visaType" type="text" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-800 placeholder-slate-400`} placeholder={t.visaType} />
                </div>
                <div className="relative">
                  <div className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-5' : 'left-5'} text-slate-400`}><Calendar className="w-5 h-5" /></div>
                  <input required={step === 2} name="travelDate" type="date" className={`w-full bg-white border-2 border-slate-200 focus:border-indigo-500 rounded-2xl py-4 ${isAr ? 'pr-14 pl-5 text-right' : 'pl-14 pr-5 text-left'} outline-none font-bold text-slate-500 uppercase`} />
                </div>
              </div>

              {/* ÉTAPE 3 : UPLOAD DE DOCUMENTS AVEC APERÇU LIVE */}
              <div className={`space-y-6 transition-all duration-500 ${step === 3 ? "block opacity-100" : "hidden opacity-0"}`}>
                
                {/* Upload Photo */}
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 hover:border-indigo-500 transition-all text-center relative overflow-hidden group">
                  <input type="file" name="photoFile" accept="image/*" ref={photoInputRef} onChange={(e) => handleFileChange(e, "photo")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  
                  {photoPreview ? (
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-white mb-4">
                        <img src={photoPreview} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>
                      <button type="button" onClick={() => removeFile("photo")} className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-bold hover:bg-rose-200 z-30 cursor-pointer relative">
                        <X className="w-4 h-4" /> {t.removeFile}
                      </button>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center pointer-events-none">
                       <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <ImageIcon className="w-8 h-8 text-indigo-500" />
                       </div>
                       <h4 className="text-lg font-bold text-slate-800">{t.uploadPhoto}</h4>
                       <p className="text-slate-500 text-sm mt-1">{t.dragDrop}</p>
                    </div>
                  )}
                </div>

                {/* Upload Passeport */}
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-6 hover:border-indigo-500 transition-all text-center relative overflow-hidden group">
                  <input type="file" name="passportFile" accept="image/*,.pdf" ref={passInputRef} onChange={(e) => handleFileChange(e, "pass")} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                  
                  {passPreview ? (
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-48 h-32 rounded-xl overflow-hidden shadow-lg border-4 border-white mb-4">
                        <img src={passPreview} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>
                      <button type="button" onClick={() => removeFile("pass")} className="flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-bold hover:bg-rose-200 z-30 cursor-pointer relative">
                        <X className="w-4 h-4" /> {t.removeFile}
                      </button>
                    </div>
                  ) : (
                    <div className="relative z-10 flex flex-col items-center pointer-events-none">
                       <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-8 h-8 text-indigo-500" />
                       </div>
                       <h4 className="text-lg font-bold text-slate-800">{t.uploadPass}</h4>
                       <p className="text-slate-500 text-sm mt-1">{t.dragDrop}</p>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* BOUTONS DE NAVIGATION */}
            <div className="flex gap-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-8 py-5 rounded-[1.5rem] font-black text-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2">
                  <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} /> {t.prev}
                </button>
              )}
              
              <button type="submit" disabled={isSubmitting} className="flex-1 relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black text-lg py-5 rounded-[1.5rem] shadow-[0_10px_40px_-10px_rgba(79,70,229,0.7)] hover:shadow-[0_10px_40px_-10px_rgba(79,70,229,1)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3">
                <span className="relative z-10">{isSubmitting ? t.loading : step < 3 ? t.next : t.submit}</span>
                {!isSubmitting && (
                  step < 3 ? <ArrowRight className={`w-5 h-5 relative z-10 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} /> 
                           : <Send className={`w-5 h-5 relative z-10 transition-transform ${isAr ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                )}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}