import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Plane, User, Phone, Calendar, MapPin, ArrowLeft, CheckCircle2, Building, DollarSign } from "lucide-react";
import Link from "next/link";

export const instant = false;

export default async function BookingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  // 1. Récupérer la réservation avec le client et l'offre associée
  const booking = await prisma.booking.findUnique({
    where: { id: resolvedParams.id },
    include: {
      client: true,
      offer: true,
      agency: true,
    },
  });

  if (!booking) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 font-sans text-slate-800">
      
      {/* BOUTON RETOUR */}
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Retour au Tableau de Bord
        </Link>
      </div>

      {/* HEADER DE LA PAGE */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-slate-100 mb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-600"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-black text-xs uppercase tracking-wider mb-3">
              <Plane className="w-3.5 h-3.5" /> Réservation Voyage
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Détails de la Réservation</h1>
            <p className="text-slate-400 text-sm mt-1">Réf : <span className="font-mono font-bold text-slate-600">{booking.id}</span></p>
          </div>
          
          <div className="bg-amber-50 text-amber-700 px-5 py-2.5 rounded-2xl font-black text-sm border border-amber-200/50 flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
            {booking.status}
          </div>
        </div>
      </div>

      {/* GRILLE DES INFORMATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* CARTE CLIENT */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4">
            <User className="w-6 h-6 text-indigo-500" /> Informations Client
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Nom Complet</span>
              <p className="text-lg font-black text-slate-800">{booking.client.firstName} {booking.client.lastName}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Téléphone</span>
              <p className="text-lg font-bold text-slate-800 flex items-center gap-2" dir="ltr">
                <Phone className="w-4 h-4 text-emerald-500" /> {booking.client.phone}
              </p>
            </div>
          </div>
        </div>

        {/* CARTE VOYAGE / OFFRE */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 space-y-6">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4">
            <MapPin className="w-6 h-6 text-emerald-500" /> Détails du Voyage
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Destination / Offre</span>
              <p className="text-lg font-black text-slate-800">{booking.offer.title}</p>
              <p className="text-sm font-bold text-emerald-600 mt-0.5">{booking.offer.destination}</p>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Tarif</span>
              <p className="text-2xl font-black text-slate-900">{booking.offer.price} <span className="text-sm text-slate-400">DA</span></p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}