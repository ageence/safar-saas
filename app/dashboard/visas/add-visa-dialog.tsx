"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, Save } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

export function AddVisaDialog({ clients }: { clients: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* BOUTON D'OUVERTURE */}
      <DialogTrigger className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105">
        <PlusCircle className="w-5 h-5" /> 
        <span>{t("addVisa")}</span>
      </DialogTrigger>
      
      {/* LE POP-UP (NON TRANSPARENT -> bg-white solide !) */}
      <DialogContent 
        dir={isAr ? "rtl" : "ltr"} 
        className="sm:max-w-[600px] bg-white border border-slate-200 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-0 overflow-hidden"
      >
        {/* HEADER DU POP-UP */}
        <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 p-8 border-b border-slate-100 flex items-center gap-5 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-indigo-100 relative z-10 flex-shrink-0">
            <FileText className="h-7 w-7 text-indigo-500" />
          </div>
          <div className="relative z-10 w-full">
            <DialogTitle className="text-3xl font-black text-slate-800 tracking-tighter">{t("newVisaFolder")}</DialogTitle>
            <p className="text-sm font-bold text-slate-500 mt-1">{t("visaDesc")}</p>
          </div>
        </div>

        {/* FORMULAIRE (Solid inputs sans transparence) */}
        <form className={`p-8 space-y-6 max-h-[70vh] overflow-y-auto ${isAr ? 'text-right' : 'text-left'}`} action="/api/visas" method="POST">
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("client")}</label>
            <select required name="clientId" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:bg-white cursor-pointer appearance-none">
              <option value="">-- {t("selectClient")} --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.lastName} {c.firstName} ({c.phone})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("countryDestination")}</label>
              <input required name="country" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:bg-white" placeholder={t("exSpain")} />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("status")}</label>
              <select required name="status" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:bg-white cursor-pointer appearance-none">
                <option value="DOC_MANQUANTS">{t("missingDocs")}</option>
                <option value="EN_ATTENTE_RDV">{t("waitingAppointment")}</option>
                <option value="DEPOT_FAIT">{t("depositDone")}</option>
                <option value="APPROUVE">{t("visaApproved")}</option>
                <option value="REFUSE">{t("refused")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("priceDa")}</label>
              <input required type="number" name="price" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:bg-white" placeholder="15000" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("appointmentDateLabel")}</label>
              <input type="date" name="appointmentDate" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("missingDocsOptional")}</label>
            <input name="notes" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:bg-white" placeholder={t("exBankStatement")} />
          </div>

          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black h-14 rounded-2xl text-lg mt-6 shadow-[0_10px_20px_rgba(99,102,241,0.2)] hover:shadow-[0_15px_30px_rgba(99,102,241,0.3)] hover:-translate-y-1 transition-all flex justify-center items-center gap-2">
            <Save className="w-5 h-5" /> {t("createFolder")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}