import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import VisaFormClient from "./visa-form-client";

export const instant = false;

export default async function PublicVisaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // 🟢 LE VRAI FIX : On cherche l'Offre de Visa par son slug !
  const visaOffer = await prisma.visaOffer.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!visaOffer) return notFound();

  // On récupère l'agence liée à cette offre
  const agency = await prisma.agency.findUnique({
    where: { id: visaOffer.agencyId }
  });

  if (!agency) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Background Luxe */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-slate-50">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-950 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="relative z-10 w-full pt-10">
        <VisaFormClient agency={agency} visaOffer={visaOffer} />
      </div>
    </main>
  );
}