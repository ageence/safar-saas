"use client";

import { useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Users, Search, Plus, Phone, Calendar, Globe } from "lucide-react";

export default function ClientsClient({ clients }: { clients: any[] }) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState("");

  // Barre de recherche intelligente
  const filteredClients = clients.filter(c =>
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* 🟢 HEADER TRADUIT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Users className="w-10 h-10 text-emerald-500" /> {t("clientsTitle")}
          </h1>
          <p className="text-slate-500 font-medium mt-1">{t("clientsDesc")}</p>
        </div>
        
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <Plus className="w-5 h-5" /> {t("addClient")}
        </button>
      </div>

      {/* 🟢 BARRE DE RECHERCHE */}
      <div className="relative max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center overflow-hidden focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
        <div className="px-4 text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder={t("searchClient")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-4 pr-4 outline-none font-medium text-slate-700 bg-transparent placeholder:text-slate-400"
        />
      </div>

      {/* 🟢 LISTE DES CLIENTS (CARTES PRO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
            {t("noClients")}
          </div>
        ) : (
          filteredClients.map((client) => (
            <div key={client.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group flex flex-col">
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                    {client.firstName.charAt(0)}{client.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-slate-800 line-clamp-1">{client.firstName} {client.lastName}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md mt-1 inline-block">
                      {client.status || t("new")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-2 flex-1">
                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                  <div className="p-2 bg-slate-50 rounded-lg"><Phone className="w-4 h-4 text-slate-400" /></div>
                  <span dir="ltr">{client.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                  <div className="p-2 bg-slate-50 rounded-lg"><Globe className="w-4 h-4 text-slate-400" /></div>
                  {t("source")} : <span className="font-bold text-slate-800">{client.source}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
                  <div className="p-2 bg-slate-50 rounded-lg"><Calendar className="w-4 h-4 text-slate-400" /></div>
                  {t("dateJoined")} : <span className="font-bold text-slate-800">{new Date(client.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'fr-FR')}</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-5 border-t border-slate-50">
                 <button className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-all border border-slate-200 text-sm">
                   {t("edit")}
                 </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}