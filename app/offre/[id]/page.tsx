import prisma from "@/lib/prisma";
import OffreClient from "./offre-client";

export const instant = false;

export default async function PublicOfferPage({ params }: { params: Promise<{ offerId: string }> }) {
  const resolvedParams = await params;
  let offer = null;
  let agency = null;

  try {
    offer = await prisma.offer.findUnique({ where: { id: resolvedParams.offerId } }) as any;
    if (offer && offer.agencyId) {
      agency = await prisma.agency.findUnique({ where: { id: offer.agencyId } }) as any;
    }
  } catch (error) {
    offer = { title: "Voyage Exclusif", price: 0 };
    agency = { name: "Safar Agency", address: "", phone: "" };
  }

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-emerald-500 selection:text-white flex items-center justify-center py-12 overflow-hidden relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-50"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-40 animate-pulse"></div>
        <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-emerald-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-30"></div>
      </div>
      <div className="relative z-10 w-full">
        <OffreClient offer={offer} agency={agency} />
      </div>
    </main>
  );
}