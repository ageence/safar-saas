export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { AddOfferDialog } from "./add-offer-dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, PlaneTakeoff, Calendar, Trash2, Edit } from "lucide-react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

// Action pour SUPPRIMER l'offre directement depuis cette page
async function deleteOfferAction(formData: FormData) {
  "use server"
  const offerId = formData.get("offerId") as string;
  try {
    // Supprimer les réservations liées d'abord pour éviter l'erreur de base de données
    await prisma.booking.deleteMany({ where: { offerId } }).catch(() => {});
    await prisma.offer.delete({ where: { id: offerId } });
    revalidatePath("/dashboard/offres");
  } catch(e) { console.error("Erreur de suppression", e); }
}

export default async function OffersPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  const rawOffers = await prisma.offer.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
  });

  const offers = rawOffers as any[];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* HEADER VIP */}
      <div className="glass-promax p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-tr from-orange-400 to-rose-500 rounded-2xl shadow-lg shadow-rose-500/20 text-white animate-float">
            <PlaneTakeoff className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Catalogue <span className="text-royal-gold">Voyages</span></h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Gérez vos séjours, Omra et affichez vos offres.</p>
          </div>
        </div>
        <AddOfferDialog />
      </div>

      {/* GRILLE DES OFFRES */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {offers.length === 0 ? (
          <div className="col-span-full glass-promax p-16 text-center flex flex-col items-center">
            <PlaneTakeoff className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-2xl font-bold text-slate-700">Aucun voyage disponible</h3>
            <p className="text-slate-500 mt-2">Cliquez sur "Créer un Voyage" pour lancer votre première offre.</p>
          </div>
        ) : (
          offers.map((offer) => {
            const startDate = offer.startDate || offer.dateDepart;
            const endDate = offer.endDate || offer.dateRetour;
            const places = offer.availableSpots ?? offer.availableSeats ?? offer.totalSeats ?? offer.places ?? "—";
            const price = offer.price || 0;

            return (
              <div key={offer.id} className="glass-promax flex flex-col overflow-hidden group relative">
                
                {/* ACTIONS : SUPPRIMER ET MODIFIER (En haut à droite) */}
                <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                  {/* Bouton Modifier (Link) */}
                  <Link href={`/dashboard/offres/${offer.id}/edit`} className="p-2.5 bg-white/90 hover:bg-cyan-50 text-cyan-600 rounded-xl shadow-lg backdrop-blur-md transition-all hover:scale-110 border border-white">
                    <Edit className="h-4 w-4" />
                  </Link>
                  {/* Bouton Supprimer (Form) */}
                  <form action={deleteOfferAction}>
                    <input type="hidden" name="offerId" value={offer.id} />
                    <button type="submit" className="p-2.5 bg-white/90 hover:bg-rose-50 text-rose-500 rounded-xl shadow-lg backdrop-blur-md transition-all hover:scale-110 border border-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
                
                {/* BANNIÈRE IMAGE */}
                <div className="h-48 bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                  {offer.imageUrl ? (
                    <img src={offer.imageUrl} alt="Affiche du voyage" className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20"><PlaneTakeoff className="h-20 w-20 text-white" /></div>
                  )}
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-white/95 text-slate-900 font-black backdrop-blur-md shadow-lg border-none px-4 py-1.5 uppercase tracking-wider text-xs">
                      {offer.type || "OFFRE"}
                    </Badge>
                  </div>
                </div>

                {/* DÉTAILS */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-slate-800 mb-4 line-clamp-2 leading-tight group-hover:text-cyan-600 transition-colors">
                    {offer.title || "Titre non défini"}
                  </h3>
                  
                  <div className="space-y-3 mt-2 flex-1">
                    {offer.destination && (
                      <div className="flex items-center text-slate-600 font-medium">
                        <MapPin className="h-5 w-5 mr-3 text-cyan-500" /> {offer.destination}
                      </div>
                    )}
                    {startDate && (
                      <div className="flex items-center text-slate-600 font-medium">
                        <Calendar className="h-5 w-5 mr-3 text-orange-500" />
                        {new Date(startDate).toLocaleDateString("fr-FR")} {endDate && ` - ${new Date(endDate).toLocaleDateString("fr-FR")}`}
                      </div>
                    )}
                    <div className="flex items-center text-slate-600 font-medium">
                      <Users className="h-5 w-5 mr-3 text-purple-500" /> {places} places disponibles
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarif</p>
                      <p className="text-2xl font-black text-slate-900">
                        {price > 0 ? new Intl.NumberFormat("fr-DZ").format(price) : "Sur devis"} <span className="text-sm text-slate-500">DA</span>
                      </p>
                    </div>
                    <a href={`/offre/${offer.id}`} target="_blank" rel="noreferrer" className="w-full bg-slate-50 hover:bg-cyan-50 border border-slate-200 hover:border-cyan-200 text-slate-700 hover:text-cyan-700 font-bold transition-all shadow-sm rounded-xl py-3 flex justify-center items-center gap-2">
                      Voir la page publique
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}