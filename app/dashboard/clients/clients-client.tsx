"use client";

import { useLanguage } from "@/components/language-provider";
import { Users, Eye, PlaneTakeoff } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AddClientDialog } from "./add-client-dialog";

export default function ClientsClient({ bookings }: { bookings: any[] }) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  const crmTitleParts = t("crmReservations").split(" & ");
  const firstPart = crmTitleParts[0];
  const secondPart = crmTitleParts.length > 1 ? (isAr ? "و " + crmTitleParts[1] : "& " + crmTitleParts[1]) : "";

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10 dark:text-white transition-colors">
      
      {/* HEADER CRM (Dark Mode) */}
      <div className="glass-promax dark:bg-slate-900 dark:border-slate-800 p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-colors">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white animate-float flex-shrink-0">
            <Users className="h-8 w-8" />
          </div>
          <div className={isAr ? "text-right" : "text-left"}>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tighter transition-colors">
              {firstPart} <span className="text-royal-ocean dark:text-cyan-400">{secondPart}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1 transition-colors">{t("crmDesc")}</p>
          </div>
        </div>
        
        <AddClientDialog />
      </div>

      {/* LISTE DES RÉSERVATIONS (Dark Mode) */}
      <div className="glass-promax dark:bg-slate-900 dark:border-slate-800 rounded-[2rem] p-8 transition-colors">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4 transition-colors">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white transition-colors">{t("lastBookings")}</h3>
          <Badge className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-none transition-colors">{bookings.length} {t("demands")}</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest transition-colors ${isAr ? 'text-right' : 'text-left'}`}>
                <th className="pb-4 font-bold px-2">{t("thClient")}</th>
                <th className="pb-4 font-bold px-2">{t("thPhone")}</th>
                <th className="pb-4 font-bold px-2">{t("thTrip")}</th>
                <th className="pb-4 font-bold px-2">{t("thDate")}</th>
                <th className="pb-4 font-bold px-2 text-center w-32">{t("thFile")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50 transition-colors">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                    {t("noBookings")}
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className={`py-4 px-2 ${isAr ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold flex-shrink-0 transition-colors">
                          {booking.client?.firstName?.charAt(0)}{booking.client?.lastName?.charAt(0)}
                        </div>
                        <span className="font-extrabold text-slate-800 dark:text-slate-200 transition-colors">
                          {booking.client?.firstName} {booking.client?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 px-2 font-semibold text-slate-600 dark:text-slate-400 transition-colors ${isAr ? 'text-right' : 'text-left'}`} dir="ltr">
                      {booking.client?.phone}
                    </td>
                    <td className={`py-4 px-2 ${isAr ? 'text-right' : 'text-left'}`}>
                      <div className="flex items-center gap-2">
                        <PlaneTakeoff className={`w-4 h-4 text-orange-400 flex-shrink-0 ${isAr ? 'ml-2' : 'mr-2'}`} />
                        <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[200px] transition-colors">{booking.offer?.title}</span>
                      </div>
                    </td>
                    <td className={`py-4 px-2 font-medium text-slate-500 dark:text-slate-400 transition-colors ${isAr ? 'text-right' : 'text-left'}`} dir="ltr">
                      {new Date(booking.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-2 text-center">
                      <Link href={`/dashboard/clients/${booking.id}`}>
                        <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:border-cyan-500 dark:hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-sm transition-all inline-flex items-center justify-center gap-2">
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