"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UploadCloud, X, Plus, PlaneTakeoff } from "lucide-react";
import { useLanguage } from "@/components/language-provider"; // 🟢 Moteur de traduction

export function AddOfferDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { t, lang } = useLanguage(); // 🟢
  const isAr = lang === 'ar';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        const img = new Image();
        img.src = base64;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          setPreview(canvas.toDataURL("image/jpeg", 0.7));
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className={`inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 font-black rounded-2xl h-14 px-8 hover:scale-105 transition-all ${isAr ? 'flex-row-reverse' : ''}`}>
        <Plus className={isAr ? "ml-2 h-6 w-6" : "mr-2 h-6 w-6"} /> {t("createTripBtn")}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-3xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-0 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
        
        <div className={`bg-gradient-to-r from-cyan-50 to-blue-50 p-8 border-b border-white/50 flex items-center gap-5 relative overflow-hidden ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}>
          <div className={`absolute top-0 w-32 h-32 bg-cyan-400/20 rounded-full blur-[30px] ${isAr ? 'left-0' : 'right-0'}`}></div>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-cyan-50 relative z-10 flex-shrink-0">
            <PlaneTakeoff className="h-7 w-7 text-cyan-500" />
          </div>
          <div className="relative z-10">
            <DialogTitle className="text-3xl font-black text-slate-800 tracking-tighter">{t("newTripTitle")}</DialogTitle>
            <p className="text-sm font-bold text-slate-500 mt-1">{t("newTripDesc")}</p>
          </div>
        </div>

        <form className="p-8 space-y-6 max-h-[70vh] overflow-y-auto" action="/api/offers" method="POST">
          
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("uploadPoster")}</label>
            {preview ? (
              <div className="relative w-full h-48 rounded-[2rem] overflow-hidden border-4 border-cyan-500 shadow-lg group">
                <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Button type="button" variant="destructive" className="rounded-xl font-bold px-6 h-12" onClick={() => setPreview(null)}>
                    <X className={isAr ? "ml-2 h-5 w-5" : "mr-2 h-5 w-5"} /> {t("changePhoto")}
                  </Button>
                </div>
                <input type="hidden" name="imageUrl" value={preview} />
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-48 rounded-[2rem] border-2 border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all flex flex-col items-center justify-center cursor-pointer group bg-slate-50/50"
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all mb-3 border border-slate-100">
                  <UploadCloud className="h-8 w-8 text-cyan-500" />
                </div>
                <p className="text-base font-black text-slate-700">{t("clickToUpload")}</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("tripTitleLabel")}</label>
              <input required name="title" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:bg-white" placeholder={t("tripTitleHolder")} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("destLabel")}</label>
              <input required name="destination" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:bg-white" placeholder={t("destHolder")} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("dateDepart")}</label>
              <input required type="date" name="dateDepart" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("dateRetour")}</label>
              <input required type="date" name="dateRetour" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("placesDispo")}</label>
              <input required type="number" name="totalSeats" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("priceDa")}</label>
              <input required name="price" type="number" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:bg-white" placeholder="250000" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("categoryLabel")}</label>
              <select required name="type" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-cyan-500 outline-none transition-all hover:bg-white cursor-pointer">
                <option value="VOYAGE">{t("catVoyage")}</option>
                <option value="OMRA">{t("catOmra")}</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black h-14 rounded-2xl text-lg mt-6 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all">
            {t("publishOfferBtn")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}