import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import OffreClient from "./offre-client";

export const instant = false;

export default async function PublicOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // 🟢 FIX CRASH : On cherche par "id" car ton dossier est [id] !
  const offer = await prisma.offer.findUnique({
    where: { id: resolvedParams.id },
    include: { agency: true }
  });

  if (!offer || !offer.agency) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-emerald-500 selection:text-white">
      <OffreClient offer={offer} agency={offer.agency} />
    </main>
  );
}