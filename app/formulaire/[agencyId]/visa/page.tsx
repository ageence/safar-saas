import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import VisaFormClient from "./visa-form-client";

export default async function PublicVisaPage({ params }: { params: { agencyId: string } }) {
  // 1. On récupère les infos (SANS le logo qui n'existe pas dans le schema)
  const agency = await prisma.agency.findUnique({
    where: { id: params.agencyId },
    select: { name: true, phone: true, address: true }
  });

  if (!agency) return notFound();

  // 2. On passe les données au client ultra-moderne
  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white">
      {/* Background décoratif premium */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900 to-slate-50"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
        <div className="absolute top-24 -left-24 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40"></div>
      </div>

      <div className="relative z-10">
        <VisaFormClient agency={agency} />
      </div>
    </main>
  );
}