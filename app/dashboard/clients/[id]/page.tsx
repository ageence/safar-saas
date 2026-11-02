export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ArrowLeft, User, PlaneTakeoff, Wallet, FileText, CheckCircle2, Printer, Plus } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// ACTION SERVEUR : Ajouter un paiement à ce dossier
async function addPaymentAction(formData: FormData) {
  "use server";
  const bookingId = formData.get("bookingId") as string;
  const clientId = formData.get("clientId") as string;
  const agencyId = formData.get("agencyId") as string;
  const amount = Number(formData.get("amount"));

  if (amount > 0) {
    try {
      await prisma.payment.create({
        data: {
          amount,
          agencyId,
          clientId,
          bookingId, 
        } as any // "as any" protège contre les crashs si tes colonnes diffèrent
      });
      revalidatePath(`/dashboard/clients/${bookingId}`);
    } catch (e) { console.error("Erreur Paiement", e); }
  }
}

export default async function ClientDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.agencyId) return null;

  // 1. Récupérer la réservation (Dossier) avec le Client et l'Offre
  const rawBooking = await prisma.booking.findUnique({
    where: { id },
    include: { client: true, offer: true }
  });
  if (!rawBooking) return notFound();
  const booking = rawBooking as any;

  // 2. Récupérer les paiements de ce client/dossier
  const rawPayments = await prisma.payment.findMany({
    where: { clientId: booking.clientId }
  }).catch(() => []); // .catch() évite le crash si la table Payment n'est pas encore bien liée
  const payments = rawPayments as any[];

  // Calculs financiers
  const totalPrice = booking.offer?.price || 0;
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const remaining = totalPrice - totalPaid;
  const isPaid = totalPrice > 0 && remaining <= 0;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-700 w-full max-w-6xl mx-auto pb-12">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter flex items-center gap-4">
            Dossier Voyageur
            {isPaid && <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-sm font-black rounded-xl uppercase tracking-widest flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Payé</span>}
          </h1>
          <p className="text-slate-500 font-medium mt-2">Référence : #{booking.id.slice(-6).toUpperCase()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/clients/${booking.id}/recu`} target="_blank">
            <button className="px-6 py-3 bg-slate-900 hover:bg-cyan-600 text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2">
              <Printer className="w-5 h-5" /> Imprimer le Reçu
            </button>
          </Link>
          <Link href="/dashboard/clients">
            <button className="px-5 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" /> Retour
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLONNE GAUCHE : INFOS CLIENT & VOYAGE */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* CARTE CLIENT */}
          <div className="glass-promax p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><User className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">Informations Client</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Nom Complet</p>
                <p className="text-lg font-black text-slate-900">{booking.client?.lastName} {booking.client?.firstName}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Téléphone</p>
                <p className="text-lg font-black text-slate-900">{booking.client?.phone}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Passeport</p>
                <p className="text-lg font-black text-slate-900">{booking.client?.passport || "Non renseigné"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Source</p>
                <p className="text-lg font-black text-slate-900">{booking.client?.source || "Site Web"}</p>
              </div>
            </div>
          </div>

          {/* CARTE VOYAGE */}
          <div className="glass-promax p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-xl"><PlaneTakeoff className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">Détails du Séjour</h2>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Offre</p>
                <p className="text-lg font-black text-slate-900">{booking.offer?.title}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Destination</p>
                <p className="text-lg font-black text-slate-900">{booking.offer?.destination}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Date Départ</p>
                <p className="text-lg font-black text-slate-900">{booking.offer?.startDate ? new Date(booking.offer.startDate).toLocaleDateString("fr-FR") : "—"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Tarif par personne</p>
                <p className="text-lg font-black text-cyan-600">{new Intl.NumberFormat("fr-DZ").format(totalPrice)} DA</p>
              </div>
            </div>
          </div>
        </div>

        {/* COLONNE DROITE : FINANCES & PAIEMENT */}
        <div className="space-y-8">
          
          <div className="glass-promax p-8 rounded-[2rem] bg-gradient-to-b from-white to-slate-50/50">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl"><Wallet className="w-6 h-6" /></div>
              <h2 className="text-2xl font-black text-slate-800">Finances</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
                <span className="font-bold text-slate-500">Total à payer</span>
                <span className="font-black text-slate-900 text-lg">{new Intl.NumberFormat("fr-DZ").format(totalPrice)} DA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl text-emerald-700">
                <span className="font-bold">Déjà payé</span>
                <span className="font-black text-lg">{new Intl.NumberFormat("fr-DZ").format(totalPaid)} DA</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-rose-50 rounded-xl text-rose-700">
                <span className="font-bold">Reste à payer</span>
                <span className="font-black text-xl">{new Intl.NumberFormat("fr-DZ").format(remaining > 0 ? remaining : 0)} DA</span>
              </div>
            </div>

            {/* FORMULAIRE D'AJOUT DE PAIEMENT */}
            {!isPaid && (
              <form action={addPaymentAction} className="mt-6 border-t border-slate-200 pt-6">
                <input type="hidden" name="bookingId" value={booking.id} />
                <input type="hidden" name="clientId" value={booking.clientId} />
                <input type="hidden" name="agencyId" value={booking.agencyId} />
                
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Ajouter un versement (DA)</label>
                <div className="flex gap-2">
                  <input type="number" name="amount" required max={remaining} placeholder="Ex: 50000" className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-md transition-all">
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* CHECKLIST DOCUMENTS (Visuel pour le moment) */}
          <div className="glass-promax p-8 rounded-[2rem]">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><FileText className="w-6 h-6" /></div>
              <h2 className="text-xl font-black text-slate-800">Documents</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
                <span className="font-bold text-slate-700">Passeport Biométrique</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
                <span className="font-bold text-slate-700">Photos d'identité</span>
              </label>
              <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50">
                <input type="checkbox" className="w-5 h-5 accent-cyan-500" />
                <span className="font-bold text-slate-700">Certificat médical</span>
              </label>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}