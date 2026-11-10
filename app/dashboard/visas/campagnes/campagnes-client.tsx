"use client";

import { useLanguage } from "@/components/language-provider";
import { Globe, Plus, Trash2, ExternalLink, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function CampagnesClient({ offres, createVisaOfferAction, deleteVisaOfferAction }: any) {
  const { t, lang } = useLanguage();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-4">{t("campaignsVisaLinks")}</h1>
          <p className="text-slate-500 font-medium mt-2">{t("campaignsDesc")}</p>
        </div>
        <Link href="/dashboard/visas">
          <button className="px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 flex items-center gap-2">
            <ArrowLeft className={`w-5 h-5 ${lang === "ar" ? "rotate-180" : ""}`} /> {t("backToVisas")}
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* CRÉATION DE LA CAMPAGNE */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/50 h-fit relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-cyan-400"></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Plus className="w-6 h-6" /></div>
            <h2 className="text-2xl font-black text-slate-800">{t("generateLink")}</h2>
          </div>
          
          <form action={createVisaOfferAction} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">{t("campaignTitle")}</label>
              <input required name="title" placeholder={t("exVisaStudy")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase">{t("targetCountry")}</label>
              <input name="country" placeholder={t("exFrance")} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg">
              <Globe className="w-5 h-5" /> {t("createPublicPage")}
            </button>
          </form>
        </div>

        {/* LISTE DES CAMPAGNES */}
        <div className="lg:col-span-2 space-y-5">
          {offres.map((offre: any) => (
            <div key={offre.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:shadow-lg transition-all relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500"></div>
              <div className="flex-1 pl-2">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-black text-2xl text-slate-800">{offre.title}</h3>
                  {offre.country && <span className="bg-cyan-100 text-cyan-700 font-bold px-3 py-1 rounded-full text-xs">{offre.country}</span>}
                </div>
                <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> {t("securePageSocial")}
                </p>
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <a href={`/demande-visa/${offre.slug}`} target="_blank" rel="noreferrer" className="flex-1 sm:flex-none bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold px-5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <ExternalLink className="w-5 h-5" /> {t("openPage")}
                </a>
                
                <form action={deleteVisaOfferAction.bind(null, offre.id)}>
                  <button type="submit" className="p-3 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all font-bold">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
          {offres.length === 0 && (
            <div className="p-16 text-center text-slate-400 font-bold border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
              {t("noCampaignsGenerated")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}