"use client";

import { ArrowLeft, User, PlaneTakeoff, Wallet, CheckCircle2, Printer, Plus } from "lucide-react";
import Link from "next/link";
import { DocumentManager } from "./document-manager"; 
import { useLanguage } from "@/components/language-provider";

export default function DossierClient({ 
  booking, payments, documents, totalPrice, totalPaid, remaining, isPaid, 
  addPaymentAction, addDocumentAction 
}: any) {
  const { t, lang } = useLanguage();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-6xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4">
            {t("travelerFile")}
            {isPaid && <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-sm rounded-xl uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> {t("paid")}</span>}
          </h1>
          <p className="text-slate-500 font-medium mt-2">{t("reference")} : #{booking.id.slice(-6).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/clients/${booking.id}/recu`} target="_blank">
            <button className="px-6 py-3 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-lg flex items-center gap-2">
              <Printer className="w-5 h-5" /> {t("generateReceipt")}
            </button>
          </Link>
          <Link href="/dashboard/clients">
            <button className="px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2">
              <ArrowLeft className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} /> {t("back")}
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="glass-promax p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><User className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">{t("clientInfo")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><p className="text-xs font-bold text-slate-400 uppercase">{t("fullName")}</p><p className="text-lg font-black text-slate-900">{booking.client?.lastName} {booking.client?.firstName}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase">{t("phone")}</p><p className="text-lg font-black text-slate-900" dir="ltr">{booking.client?.phone}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase">{t("passport")}</p><p className="text-lg font-black text-slate-900">{booking.client?.passport || t("notProvided")}</p></div>
            </div>
          </div>

          <div className="glass-promax p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><PlaneTakeoff className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">{t("stayDetails")}</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div><p className="text-xs font-bold text-slate-400 uppercase">{t("offer")}</p><p className="text-lg font-black text-slate-900">{booking.offer?.title}</p></div>
              <div><p className="text-xs font-bold text-slate-400 uppercase">{t("pricePerPerson")}</p><p className="text-lg font-black text-cyan-600">{new Intl.NumberFormat("fr-DZ").format(totalPrice)} DA</p></div>
            </div>
          </div>

          {/* TON GESTIONNAIRE DE DOCUMENTS (INTACT) */}
          <DocumentManager bookingId={booking.id} documents={documents} onUpload={addDocumentAction} />

        </div>

        {/* COLONNE DROITE : FINANCES & PAIEMENT */}
        <div className="space-y-8">
          <div className="glass-promax p-8 rounded-[2rem] bg-gradient-to-b from-white to-slate-50/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Wallet className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">{t("finances")}</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-500">{t("total")}</span>
                <span className="font-black text-slate-900 text-lg">{new Intl.NumberFormat("fr-DZ").format(totalPrice)} DA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl text-emerald-700">
                <span className="font-bold">{t("alreadyPaid")}</span>
                <span className="font-black text-lg">{new Intl.NumberFormat("fr-DZ").format(totalPaid)} DA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl text-rose-700">
                <span className="font-bold">{t("remaining")}</span>
                <span className="font-black text-xl">{new Intl.NumberFormat("fr-DZ").format(remaining > 0 ? remaining : 0)} DA</span>
              </div>
            </div>

            {/* HISTORIQUE */}
            {payments.length > 0 && (
               <div className="mb-6 space-y-2">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-2 block">{t("paymentHistory")}</p>
                 {payments.map((p: any) => (
                   <div key={p.id} className="flex justify-between text-sm font-bold text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                     <span>{new Date(p.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR')}</span>
                     <span className="text-emerald-600">+{new Intl.NumberFormat("fr-DZ").format(p.amount)} DA</span>
                   </div>
                 ))}
               </div>
            )}

            {/* FORMULAIRE PAIEMENT (INTACT) */}
            {!isPaid && (
              <form action={addPaymentAction} className="mt-6 border-t border-slate-200 pt-6">
                <input type="hidden" name="bookingId" value={booking.id} />
                <input type="hidden" name="clientId" value={booking.clientId} />
                <input type="hidden" name="agencyId" value={booking.agencyId} />
                
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">{t("newPayment")} (DA)</label>
                <div className="flex gap-2">
                  <input type="number" name="amount" required max={remaining > 0 ? remaining : undefined} placeholder="Ex: 50000" className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-md transition-all"><Plus className="w-6 h-6" /></button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}