"use client";

import { useLanguage } from "@/components/language-provider";
import { Users, Eye, PlaneTakeoff } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddClientDialog } from "./add-client-dialog"; // 🟢 On importe le Pop-up !

export default function ClientsClient({ bookings }: { bookings: any[] }) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  const crmTitleParts = t("crmReservations").split(" & ");
  const firstPart = crmTitleParts[0];
  const secondPart = crmTitleParts.length > 1 ? (isAr ? "و " + crmTitleParts[1] : "& " + crmTitleParts[1]) : "";

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* HEADER CRM */}
      <div className="glass-promax p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white animate-float flex-shrink-0">
            <Users className="h-8 w-8" />
          </div>
          <div className={isAr ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">
              {firstPart} <span className="text-royal-ocean">{secondPart}</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-1">{t("crmDesc")}</p>
          </div>
        </div>
        
        {/* 🟢 LE BOUTON D'AJOUT OUVRE MAINTENANT LE POP-UP */}
        <AddClientDialog />
      </div>

      {/* LISTE DES RÉSERVATIONS */}
      <div className="glass-promax rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold text-slate-800">{t("lastBookings")}</h3>
          <Badge className="bg-emerald-50 text-emerald-600 border-none">{bookings.length} {t("demands")}</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'}`}>
                <th className="pb-4 font-bold px-2">{t("thClient")}</th>
                <th className="pb-4 font-bold px-2">{t("thPhone")}</th>
                <th className="pb-4 font-bold px-2">{t("thTrip")}</th>
                <th className="pb-4 font-bold px-2">{t("thDate")}</th>
                <th className={`pb-4 font-bold px-2 ${isAr ? 'text-left' : 'text-right'}`}>{t("thFile")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    {t("noBookings")}
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className={`py-4 px-2 ${isAr ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold flex-shrink-0">
                          {booking.client?.firstName?.charAt(0)}{booking.client?.lastName?.charAt(0)}
                        </div>
                        <span className="font-extrabold text-slate-800">
                          {booking.client?.firstName} {booking.client?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 px-2 font-semibold text-slate-600 ${isAr ? 'text-right' : 'text-left'}`} dir="ltr">
                      {booking.client?.phone}
                    </td>
                    <td className={`py-4 px-2 ${isAr ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2">
                        <PlaneTakeoff className={`w-4 h-4 text-orange-400 flex-shrink-0 ${isAr ? 'ml-2' : 'mr-2'}`} />
                        <span className="font-bold text-slate-700 truncate max-w-[200px]">{booking.offer?.title}</span>
                      </div>
                    </td>
                    
                    {/* 🟢 CORRECTION: On force fr-FR pour que les chiffres soient toujours 12/11/2026 */}
                    <td className={`py-4 px-2 font-medium text-slate-500 ${isAr ? 'text-right' : 'text-left'}`} dir="ltr">
                      {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    
                    <td className={`py-4 px-2 ${isAr ? 'text-left' : 'text-right'}`}>
                      <Link href={`/dashboard/clients/${booking.id}`}>
                        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:border-cyan-500 hover:text-cyan-600 hover:shadow-md transition-all inline-flex items-center justify-center gap-2">
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
    </div>
  );
}