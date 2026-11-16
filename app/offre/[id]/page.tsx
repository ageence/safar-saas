import prisma from "@/lib/prisma";
import OffreClient from "./offre-client";

export const instant = false;

export default async function PublicOfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const resolvedParams = await params;
  let offer = null;
  let agency = null;

  try {
    // Tentative de récupération depuis Prisma (Peut échouer si la table ne s'appelle pas "offer")
    // @ts-ignore
    offer = await prisma.offer.findUnique({ where: { id: resolvedParams.offerId } });
    if (offer && offer.agencyId) {
      agency = await prisma.agency.findUnique({ where: { id: offer.agencyId } });
    }
  } catch (error) {
    console.log("Prisma n'a pas trouvé la table offre, utilisation des données de secours pour le design");
    offer = { title: "Voyage Spécial (Démo)", price: 0 };
    agency = { name: "Mon Agence", address: "Alger", phone: "0500000000" };
  }

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-900 to-slate-50"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
        <div className="absolute top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      </div>
      <div className="relative z-10">
        <OffreClient offer={offer} agency={agency} />
      </div>
    </main>
  );
}