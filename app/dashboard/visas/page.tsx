export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { FileText, Calendar, AlertCircle, Eye, Passport } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddVisaDialog } from "./add-visa-dialog"; // Ton composant d'ajout reste intact !
import Link from "next/link";

export default async function VisasPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  // On récupère les visas ET on inclut les infos du client lié
  const rawVisas = await prisma.visaApplication.findMany({
    where: { agencyId },
    include: { client: true },
    orderBy: { updatedAt: "desc" },
  });
  const visas = rawVisas as any[];

  // On récupère la liste des clients pour ton menu déroulant d'ajout
  const clients = await prisma.client.findMany({
    where: { agencyId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: "asc" }
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "EN_ATTENTE": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 border-none">Attente Docs</Badge>;
      case "RNDV_PRIS": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">Rendez-vous</Badge>;
      case "EN_COURS": return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">En Traitement</Badge>;
      case "APPROUVE": return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Approuvé ✅</Badge>;
      case "REFUSE": return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none">Refusé ❌</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full pb-10">
      
      {/* HEADER VIP */}
      <div className="glass-promax p-8 rounded-[2rem] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white animate-float">
            <Passport className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">Dossiers <span className="text-indigo-600">Visa</span></h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Gérez les demandes de visa, rendez-vous et passeports.</p>
          </div>
        </div>
        
        {/* TON BOUTON D'AJOUT EST LÀ */}
        <AddVisaDialog clients={clients} />
      </div>

      {/* TABLEAU DES DOSSIERS */}
      <div className="glass-promax rounded-[2rem] p-8 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest">
              <TableHead className="font-bold pb-4">Client</TableHead>
              <TableHead className="font-bold pb-4">Destination</TableHead>
              <TableHead className="font-bold pb-4">Statut</TableHead>
              <TableHead className="font-bold pb-4">Date de RDV</TableHead>
              <TableHead className="font-bold pb-4">Notes</TableHead>
              <TableHead className="font-bold pb-4 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-medium">
                  Aucun dossier de visa en cours.
                </TableCell>
              </TableRow>
            ) : (
              visas.map((visa) => (
                <TableRow key={visa.id} className="hover:bg-slate-50/50 border-b border-slate-50 transition-colors">
                  <TableCell className="font-extrabold text-slate-800 py-4">
                    {visa.client?.lastName} {visa.client?.firstName}
                  </TableCell>
                  
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 font-bold text-slate-600">
                      <FileText className="h-4 w-4 text-indigo-500" />
                      {visa.country} {visa.type && <span className="text-xs font-normal text-slate-400">({visa.type})</span>}
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-4">
                    {getStatusBadge(visa.status)}
                  </TableCell>
                  
                  <TableCell className="py-4">
                    {visa.appointmentDate ? (
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-slate-100 w-fit px-3 py-1 rounded-lg">
                        <Calendar className="h-4 w-4 text-orange-500" />
                        {new Date(visa.appointmentDate).toLocaleDateString('fr-FR')}
                      </div>
                    ) : (
                      <span className="text-slate-300 text-sm font-medium">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="py-4 text-sm max-w-[200px]">
                    {visa.notes ? (
                      <div className="flex items-start gap-2 text-rose-500">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2 text-xs font-bold leading-tight">{visa.notes}</span>
                      </div>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </TableCell>
                  
                  <TableCell className="py-4 text-right">
                    {/* LE FAMEUX BOUTON "OUVRIR" POUR ALLER AU DOSSIER COMPLET */}
                    <Link href={`/dashboard/visas/${visa.id}`}>
                      <button className="px-5 py-2.5 bg-white border border-slate-200 text-indigo-600 font-bold rounded-xl hover:border-indigo-500 shadow-sm flex items-center gap-2 ml-auto transition-all">
                        <Eye className="w-4 h-4" /> Ouvrir
                      </button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}