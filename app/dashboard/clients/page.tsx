export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Users, FileText, CheckCircle, Search, Eye, Calendar, PlaneTakeoff } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function ClientsPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  // On récupère toutes les réservations liées à ton agence
  const rawBookings = await prisma.booking.findMany({
    where: { agencyId: agencyId },
    include: { 
      client: true, 
      offer: true 
    },
    orderBy: { createdAt: "desc" },
  });

  const bookings = rawBookings as any[];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* HEADER CRM */}
      <div className="glass-promax p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-tr from-emerald-400 to-cyan-500 rounded-2xl shadow-lg shadow-cyan-500/20 text-white animate-float">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">CRM & <span className="text-royal-ocean">Réservations</span></h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Gérez vos clients, dossiers et paiements.</p>
          </div>
        </div>
      </div>

      {/* LISTE DES RÉSERVATIONS */}
      <div className="glass-promax rounded-[2rem] p-8">
        <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold text-slate-800">Dernières Réservations</h3>
          <Badge className="bg-emerald-50 text-emerald-600 border-none">{bookings.length} Demandes</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest">
                <th className="pb-4 font-bold">Client</th>
                <th className="pb-4 font-bold">Téléphone</th>
                <th className="pb-4 font-bold">Voyage / Omra</th>
                <th className="pb-4 font-bold">Date de Demande</th>
                <th className="pb-4 font-bold text-right">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                    Aucune réservation pour le moment.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                          {booking.client?.firstName?.charAt(0)}{booking.client?.lastName?.charAt(0)}
                        </div>
                        <span className="font-extrabold text-slate-800">
                          {booking.client?.firstName} {booking.client?.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 font-semibold text-slate-600">{booking.client?.phone}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <PlaneTakeoff className="w-4 h-4 text-orange-400" />
                        <span className="font-bold text-slate-700 truncate max-w-[200px]">{booking.offer?.title}</span>
                      </div>
                    </td>
                    <td className="py-4 font-medium text-slate-500">
                      {new Date(booking.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-4 text-right">
                      {/* LE BOUTON POUR OUVRIR LE DOSSIER DU CLIENT */}
                      <Link href={`/dashboard/clients/${booking.id}`}>
                        <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:border-cyan-500 hover:text-cyan-600 hover:shadow-md transition-all flex items-center gap-2 ml-auto">
                          <Eye className="w-4 h-4" /> Ouvrir
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