"use client";

import { useLanguage } from "@/components/language-provider";
import { FileText, Calendar, AlertCircle, Eye, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { AddVisaDialog } from "./add-visa-dialog"; 

export default function VisasClient({ visas, clients }: { visas: any[], clients: any[] }) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "EN_ATTENTE":
      case "DOC_MANQUANTS": 
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none px-3 py-1">{t("waitingDocs")}</Badge>;
      case "RNDV_PRIS":
      case "EN_ATTENTE_RDV": 
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-3 py-1">{t("appointmentBooked")}</Badge>;
      case "EN_COURS":
      case "DEPOT_FAIT": 
        return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none px-3 py-1">{t("processing")}</Badge>;
      case "APPROUVE": 
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-3 py-1">{t("visaApproved")}</Badge>;
      case "REFUSE": 
        return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none px-3 py-1">{t("visaRefused")}</Badge>;
      default: 
        return <Badge variant="outline" className="px-3 py-1">{status}</Badge>;
    }
  };

  return (
    // 🟢 On applique le RTL à toute la page pour l'Arabe
    <div dir={isAr ? "rtl" : "ltr"} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* HEADER VISAS */}
      <div className="glass-promax p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white animate-float flex-shrink-0">
            <Globe className="h-8 w-8" />
          </div>
          <div className={isAr ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">{t("visaManagement")}</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">{t("visaDesc")}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/dashboard/visas/campagnes" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all border border-indigo-400/50">
              <Globe className="w-5 h-5" /> <span>{t("campaignsLinks")}</span>
            </button>
          </Link>
          {/* L'AJOUT DE VISA SE FAIT ICI VIA LE DIALOG */}
          <div className="w-full sm:w-auto">
            <AddVisaDialog clients={clients} />
          </div>
        </div>
      </div>

      {/* TABLEAU DES VISAS - ALIGNEMENT PARFAIT */}
      <div className="glass-promax rounded-[2rem] p-8 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className={`border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'}`}>
              <th className="pb-4 font-bold px-4">{t("thClient")}</th>
              <th className="pb-4 font-bold px-4">{t("countryDestination")}</th>
              <th className="pb-4 font-bold px-4">{t("status")}</th>
              <th className="pb-4 font-bold px-4">{t("appointmentDate")}</th>
              <th className="pb-4 font-bold px-4">{t("remarksNotes")}</th>
              <th className={`pb-4 font-bold px-4 ${isAr ? 'text-left' : 'text-right'}`}>{t("action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {visas.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-32 text-center text-slate-400 font-medium">
                  {t("noVisas")}
                </td>
              </tr>
            ) : (
              visas.map((visa) => (
                <tr key={visa.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors group">
                  <td className={`py-4 px-4 font-extrabold text-slate-800 ${isAr ? 'text-right' : 'text-left'}`}>
                    {visa.client?.lastName} {visa.client?.firstName}
                  </td>
                  
                  <td className={`py-4 px-4 ${isAr ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 font-bold text-slate-600">
                      <FileText className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                      <span>{visa.country}</span>
                    </div>
                  </td>
                  
                  <td className={`py-4 px-4 ${isAr ? 'text-right' : 'text-left'}`}>
                    {getStatusBadge(visa.status)}
                  </td>
                  
                  <td className={`py-4 px-4 ${isAr ? 'text-right' : 'text-left'}`}>
                    {visa.appointmentDate ? (
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 w-fit px-3 py-1 rounded-lg" dir="ltr">
                        <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                        {new Date(visa.appointmentDate).toLocaleDateString('fr-FR')}
                      </div>
                    ) : <span className="text-slate-300 text-sm font-medium">-</span>}
                  </td>
                  
                  <td className={`py-4 px-4 text-sm max-w-[200px] ${isAr ? 'text-right' : 'text-left'}`}>
                    {visa.notes ? (
                      <div className="flex items-start gap-2 text-rose-500">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2 text-xs font-bold leading-tight">{visa.notes}</span>
                      </div>
                    ) : <span className="text-slate-300">-</span>}
                  </td>
                  
                  <td className={`py-4 px-4 ${isAr ? 'text-left' : 'text-right'}`}>
                    <Link href={`/dashboard/visas/${visa.id}`}>
                      <button className="px-5 py-2.5 bg-white border border-slate-200 text-indigo-600 font-bold rounded-xl hover:border-indigo-500 shadow-sm flex items-center justify-center gap-2 transition-all">
                        <Eye className="w-4 h-4" /> <span>{t("openFile")}</span>
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}