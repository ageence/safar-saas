import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { FileText, Calendar, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddVisaDialog } from "./add-visa-dialog";

export default async function VisasPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  // On récupère les visas ET on inclut les infos du client lié
  const visas = await prisma.visaApplication.findMany({
    where: { agencyId },
    include: { client: true },
    orderBy: { updatedAt: "desc" },
  });

  // On récupère la liste des clients pour le menu déroulant d'ajout
  const clients = await prisma.client.findMany({
    where: { agencyId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { lastName: "asc" }
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "DOC_MANQUANTS": return <Badge variant="destructive">Docs Manquants</Badge>;
      case "EN_ATTENTE_RDV": return <Badge variant="secondary">Attente RDV</Badge>;
      case "DEPOT_FAIT": return <Badge variant="default" className="bg-blue-600">Dépôt Effectué</Badge>;
      case "APPROUVE": return <Badge variant="default" className="bg-green-600">Approuvé</Badge>;
      case "REFUSE": return <Badge variant="destructive">Refusé</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dossiers Visas</h1>
          <p className="text-muted-foreground">Suivez l'avancement des démarches consulaires.</p>
        </div>
        <AddVisaDialog clients={clients} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de RDV</TableHead>
              <TableHead>Notes / Manquants</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun dossier de visa en cours.
                </TableCell>
              </TableRow>
            ) : (
              visas.map((visa) => (
                <TableRow key={visa.id}>
                  <TableCell className="font-medium">
                    {visa.client.lastName} {visa.client.firstName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 font-semibold">
                      <FileText className="h-4 w-4 text-primary" />
                      {visa.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(visa.status)}
                  </TableCell>
                  <TableCell>
                    {visa.appointmentDate ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {visa.appointmentDate.toLocaleDateString('fr-FR')}
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {visa.missingDocs ? (
                      <div className="flex items-center gap-2 text-orange-500">
                        <AlertCircle className="h-4 w-4" />
                        <span className="line-clamp-1">{visa.missingDocs}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
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