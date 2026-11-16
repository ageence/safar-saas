import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import VisaFormClient from "./visa-form-client";

export const instant = false;

export default async function PublicVisaPage({ params }: { params: Promise<{ agencyId: string }> }) {
  const resolvedParams = await params;
  const agency = await prisma.agency.findUnique({
    where: { id: resolvedParams.agencyId },
    select: { id: true, name: true, phone: true, address: true }
  });

  if (!agency) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white">
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