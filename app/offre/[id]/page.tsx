import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import OffreClient from "./offre-client";

// Sécurité Vercel Next.js 16
export const instant = false;

export default async function PublicOfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const resolvedParams = await params;

  // On récupère l'offre ET les infos de l'agence qui l'a créée
  const offer = await prisma.offer.findUnique({
    where: { id: resolvedParams.offerId },
    include: {
      agency: {
        select: { id: true, name: true, phone: true, address: true }
      }
    }
  });

  if (!offer || !offer.agency) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Background décoratif premium spécial Voyage (Tons Émeraude/Indigo) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-900 to-slate-50"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
        <div className="absolute top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      </div>

      <div className="relative z-10">
        <OffreClient offer={offer} agency={offer.agency} />
      </div>
    </main>
  );
}