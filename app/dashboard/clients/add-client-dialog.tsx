"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle, UserPlus, Save, User } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function AddClientDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* LE BOUTON QUI OUVRE LE POP-UP */}
      <DialogTrigger className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center transition-all hover:scale-105 gap-2">
        <PlusCircle className="w-5 h-5" /> 
        <span>{t("addClient")}</span>
      </DialogTrigger>
      
      {/* LE POP-UP LUI-MÊME */}
      <DialogContent 
        dir={isAr ? "rtl" : "ltr"} 
        className="sm:max-w-[600px] bg-white/95 backdrop-blur-3xl border border-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-0 overflow-hidden"
      >
        <div className={`bg-gradient-to-r from-emerald-50 to-cyan-50 p-8 border-b border-white/50 flex items-center gap-5 relative overflow-hidden ${isAr ? 'text-right' : 'text-left'}`}>
          <div className={`absolute top-0 w-32 h-32 bg-emerald-400/20 rounded-full blur-[30px] ${isAr ? 'left-0' : 'right-0'}`}></div>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-emerald-50 relative z-10 flex-shrink-0">
            <UserPlus className="h-7 w-7 text-emerald-500" />
          </div>
          <div className="relative z-10 w-full">
            <DialogTitle className="text-3xl font-black text-slate-800 tracking-tighter">{t("addClient")}</DialogTitle>
            <p className="text-sm font-bold text-slate-500 mt-1">{t("clientsDesc")}</p>
          </div>
        </div>

        {/* FORMULAIRE D'AJOUT DE CLIENT */}
        <form className={`p-8 space-y-5 max-h-[70vh] overflow-y-auto ${isAr ? 'text-right' : 'text-left'}`} action="/api/clients" method="POST">
          
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("lastName")}</label>
              <div className="relative">
                <input required name="lastName" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:bg-white ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'}`} placeholder="..." />
                <User className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 ${isAr ? 'right-4' : 'left-4'}`} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("firstName")}</label>
              <input required name="firstName" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:bg-white" placeholder="..." />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("phone")}</label>
            {/* L'input du téléphone reste en LTR pour que le numéro s'écrive correctement */}
            <input required name="phone" dir="ltr" className={`w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:bg-white ${isAr ? 'text-right' : 'text-left'}`} placeholder="+213 555 55 55 55" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("passport")}</label>
              <input name="passport" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:bg-white" placeholder="..." />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("source")}</label>
              <select name="source" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 outline-none transition-all hover:bg-white cursor-pointer">
                <option value="AGENCE">Agence (Sur place)</option>
                <option value="FACEBOOK">Facebook</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="TIKTOK">TikTok</option>
                <option value="TELEPHONE">Téléphone</option>
              </select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black h-14 rounded-2xl text-lg mt-6 shadow-[0_10px_20px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all flex justify-center items-center gap-2">
            <Save className="w-5 h-5" /> {t("addClient")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}