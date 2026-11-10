"use client";

import { useLanguage } from "@/components/language-provider";
import { ArrowLeft, User, Wallet, Calendar, Printer, Plus, Save } from "lucide-react";
import Link from "next/link";
import { VisaDocumentManager } from "./visa-document-manager";

export function VisaDossierClient({ 
  visa, totalPaid, remaining, isPaid, 
  editClientAction, updateVisaAction, addPaymentAction, addDocumentAction, deleteDocumentAction 
}: any) {
  const { t, lang } = useLanguage();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4">{t("visaFolder")} {visa.country}</h1>
          <p className="text-slate-500 font-medium mt-2">{t("client")} : {visa.client?.firstName} {visa.client?.lastName}</p>
        </div>
        <div className="flex items-center gap-3">
           <Link href={`/dashboard/visas/${visa.id}/recu`} target="_blank">
             <button className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg flex items-center gap-2 hover:bg-indigo-600 transition-all">
                <Printer className="w-5 h-5" /> {t("generateReceipt")}
             </button>
           </Link>
           <Link href="/dashboard/visas">
            <button className="px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2">
              <ArrowLeft className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} /> {t("back")}
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE (Infos Client + Finances) */}
        <div className="space-y-8">
          
          <div className="glass-promax p-8 rounded-[2rem] bg-indigo-50 border-indigo-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-indigo-500 text-white rounded-xl"><User className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">{t("clientInfo")}</h2>
            </div>
            
            <form action={editClientAction} className="space-y-4">
              <input type="hidden" name="clientId" value={visa.clientId} />
              <input type="hidden" name="visaId" value={visa.id} />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">{t("lastName")}</label>
                  <input name="lastName" defaultValue={visa.client?.lastName} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">{t("firstName")}</label>
                  <input name="firstName" defaultValue={visa.client?.firstName} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">{t("phone")}</label>
                <input name="phone" dir="ltr" defaultValue={visa.client?.phone} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">{t("passport")}</label>
                <input name="passport" defaultValue={visa.client?.passport || ""} className="w-full bg-white border border-indigo-200 rounded-xl px-4 py-2 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex justify-center items-center gap-2">
                <Save className="w-4 h-4" /> {t("updateClient")}
              </button>
            </form>
          </div>

          {/* 🟢 FINANCES MOUNTÉ ICI (À GAUCHE, SOUS LE CLIENT) */}
          <div className="glass-promax p-8 rounded-[2rem] bg-gradient-to-b from-white to-slate-50/50 border-emerald-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Wallet className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">{t("finances")}</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-500">{t("visaPrice")}</span>
                <span className="font-black text-slate-900 text-lg">{new Intl.NumberFormat("fr-DZ").format(visa.price)} DA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl text-emerald-700">
                <span className="font-bold">{t("alreadyPaid")}</span>
                <span className="font-black text-lg">{new Intl.NumberFormat("fr-DZ").format(totalPaid)} DA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl text-rose-700">
                <span className="font-bold">{t("remainingToPay")}</span>
                <span className="font-black text-xl">{new Intl.NumberFormat("fr-DZ").format(remaining > 0 ? remaining : 0)} DA</span>
              </div>
            </div>

            {!isPaid && (
              <form action={addPaymentAction} className="mt-6 border-t border-slate-200 pt-6">
                <input type="hidden" name="visaId" value={visa.id} />
                <input type="hidden" name="clientId" value={visa.clientId} />
                <input type="hidden" name="agencyId" value={visa.agencyId} />
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t("newPayment")}</label>
                <div className="flex gap-2">
                  <input type="number" name="amount" required max={remaining > 0 ? remaining : undefined} className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500" />
                  <button type="submit" className="bg-emerald-500 text-white p-3 rounded-xl shadow-md"><Plus className="w-6 h-6" /></button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* COLONNE DROITE (Gestion RDV + Documents) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-promax p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><Calendar className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">{t("managementAndAppointment")}</h2>
            </div>

            <form action={updateVisaAction} className="space-y-5">
              <input type="hidden" name="id" value={visa.id} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">{t("servicePrice")}</label>
                  <input name="price" type="number" defaultValue={visa.price} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">{t("status")}</label>
                  <select name="status" defaultValue={visa.status} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none">
                    <option value="EN_ATTENTE">{t("waitingDocs")}</option>
                    <option value="RNDV_PRIS">{t("appointmentBooked")}</option>
                    <option value="EN_COURS">{t("processing")}</option>
                    <option value="APPROUVE">{t("visaApproved")}</option>
                    <option value="REFUSE">{t("visaRefused")}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">{t("appointmentDate")}</label>
                  <input name="appointmentDate" type="date" defaultValue={visa.appointmentDate ? new Date(visa.appointmentDate).toISOString().split('T')[0] : ""} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">{t("appointmentLink")}</label>
                  <input name="appointmentLink" defaultValue={visa.appointmentLink || ""} placeholder={t("linkPlaceholder")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">{t("remarksNotes")}</label>
                <textarea name="notes" rows={2} defaultValue={visa.notes || ""} placeholder={t("missingCertPlaceholder")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2">
                <Save className="w-5 h-5" /> {t("saveVisaInfo")}
              </button>
            </form>
          </div>

          <VisaDocumentManager visaId={visa.id} documents={visa.documents || []} onUpload={addDocumentAction} onDelete={deleteDocumentAction} />
        </div>
      </div>
    </div>
  );
}