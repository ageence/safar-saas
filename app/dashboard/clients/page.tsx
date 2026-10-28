

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Search, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddClientDialog } from "./add-client-dialog";

export default async function ClientsPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  const clients = await prisma.client.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients (CRM)</h1>
          <p className="text-muted-foreground">
            Gérez vos prospects et communications clients.
          </p>
        </div>
        {/* Le composant que nous venons de créer */}
        <AddClientDialog />
      </div>

      <div className="flex items-center space-x-2 bg-card p-2 border rounded-md max-w-sm">
        <Search className="h-5 w-5 text-muted-foreground ml-2" />
        <Input 
          placeholder="Rechercher un numéro, un nom..." 
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom & Prénom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Aucun client enregistré pour le moment.
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.lastName} {client.firstName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      {client.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.source}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={client.status === "PROSPECT" ? "secondary" : "default"}>
                      {client.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4 text-green-500" />
                      </a>
                    </Button>
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