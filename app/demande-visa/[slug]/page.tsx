import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import VisaFormClient from "./visa-form-client";

export const instant = false;

// 🟢 LE FIX : On utilise "slug" ici pour correspondre au nom de ton dossier
export default async function PublicVisaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  // 🟢 On cherche l'agence en utilisant le slug (qui contient l'ID "admin-agence-...")
  const agency = await prisma.agency.findUnique({
    where: { id: resolvedParams.slug } 
  }) as any; 

  if (!agency) return notFound();

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white flex items-center justify-center py-12 overflow-hidden relative">
      {/* Background ultra-premium */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-950 via-indigo-900 to-slate-50"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-50 animate-pulse"></div>
        <div className="absolute top-40 -left-20 w-[500px] h-[500px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-[150px] opacity-40"></div>
      </div>
      
      <div className="relative z-10 w-full">
        <VisaFormClient agency={agency} />
      </div>
    </main>
  );
}