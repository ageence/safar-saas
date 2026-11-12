"use client";

import { useLanguage } from "@/components/language-provider";
import { Wallet, ArrowUpRight, ArrowDownRight, Activity, CalendarDays, Filter, PieChart, RefreshCcw } from "lucide-react";
import Link from "next/link";

export function FinancesClient({ 
  caTotal, pctVoyage, pctVisa, caEnAttente, transactions, defaultDebut, defaultFin 
}: any) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* HEADER & FILTRES */}
      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 relative overflow-hidden">
        <div className={`absolute top-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl ${isAr ? 'left-0' : 'right-0'}`}></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Wallet className="w-10 h-10 text-rose-500" /> {t("financialFlow")}
          </h1>
          <p className="text-slate-500 font-medium mt-1">{t("financesDesc")}</p>
        </div>
        
        <form className="relative z-10 flex flex-wrap items-end gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">{t("filterFrom")}</label>
            <input type="date" name="dateDebut" defaultValue={defaultDebut} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm outline-none focus:border-rose-500" />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">{t("filterTo")}</label>
            <input type="date" name="dateFin" defaultValue={defaultFin} className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm outline-none focus:border-rose-500" />
          </div>
          <button type="submit" className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" /> {t("filterBtn")}
          </button>
          {(defaultDebut || defaultFin) && (
            <Link href="/dashboard/finances">
              <button type="button" className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold p-2.5 rounded-xl transition-all">
                <RefreshCcw className="w-4 h-4" />
              </button>
            </Link>
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
          <div className={`absolute top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all ${isAr ? 'left-0' : 'right-0'}`}></div>
          <p className="text-sm font-extrabold text-slate-500 uppercase flex items-center gap-2 mb-2"><Activity className="w-4 h-4 text-emerald-500" /> {t("totalCashed")}</p>
          <h2 className="text-4xl font-black text-slate-900 relative z-10">{new Intl.NumberFormat('fr-DZ').format(caTotal)} <span className="text-xl text-slate-400">DA</span></h2>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all flex flex-col justify-center">
          <p className="text-sm font-extrabold text-slate-500 uppercase flex items-center gap-2 mb-4"><PieChart className="w-4 h-4 text-blue-500" /> {t("profitSplit")}</p>
          <div className="flex w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3" dir="ltr">
            <div className="bg-orange-500 h-full" style={{ width: `${pctVoyage}%` }}></div>
            <div className="bg-purple-500 h-full" style={{ width: `${pctVisa}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-orange-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> {t("pctVoyages")}: {pctVoyage}%</span>
            <span className="text-purple-600 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> {t("pctVisas")}: {pctVisa}%</span>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-transparent"></div>
          <p className="text-sm font-extrabold text-slate-400 uppercase flex items-center gap-2 mb-2 relative z-10"><CalendarDays className="w-4 h-4 text-rose-400" /> {t("remainingToCollect")}</p>
          <h2 className="text-4xl font-black text-white relative z-10">{new Intl.NumberFormat('fr-DZ').format(caEnAttente)} <span className="text-xl text-slate-500">DA</span></h2>
        </div>

      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 flex items-center flex-wrap gap-2">
            {t("transactionDetails")} 
            {(defaultDebut || defaultFin) && <span className="text-rose-500 text-sm">{t("filteredPeriod")}</span>}
          </h3>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            {t("noFinanceData")}
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((trans: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl transition-colors border border-slate-100 hover:border-rose-100">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <div className={`p-3 rounded-xl ${trans.type === 'Visa' ? 'bg-purple-100 text-purple-600' : 'bg-orange-100 text-orange-600'}`}>
                    {trans.type === 'Visa' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg leading-tight">{trans.client}</h4>
                    <p className="text-xs font-bold text-slate-400" dir="ltr">
                      {trans.type === 'Visa' ? t("visas") : t("voyages")} • {new Date(trans.date).toLocaleDateString(isAr ? 'ar-EG' : 'fr-FR')} 
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end ${isAr ? 'flex-row-reverse' : ''}`}>
                  {/* 🟢 CORRECTION: On traduit absolument TOUS les statuts possibles */}
                  <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest bg-slate-100 text-slate-500`}>
                    {
                      trans.status === 'EN_ATTENTE' ? t("pending") : 
                      trans.status === 'DOC_MANQUANTS' ? t("missingDocs") :
                      trans.status === 'EN_ATTENTE_RDV' ? t("waitingAppointment") :
                      trans.status === 'RNDV_PRIS' ? t("appointmentBooked") :
                      trans.status === 'EN_COURS' || trans.status === 'DEPOT_FAIT' ? t("processing") :
                      trans.status === 'APPROUVE' || trans.status === 'CONFIRME' ? t("approved") : 
                      trans.status === 'PAYE' ? t("paid") : 
                      trans.status === 'REFUSE' ? t("refused") : trans.status
                    }
                  </span>
                  <span className={`font-black text-xl w-32 ${isAr ? 'text-left' : 'text-right'} ${trans.status === 'EN_ATTENTE' || trans.status === 'DOC_MANQUANTS' ? 'text-slate-400' : 'text-slate-900'}`} dir="ltr">
                    {new Intl.NumberFormat('fr-DZ').format(trans.amount)} <span className="text-sm">DA</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}