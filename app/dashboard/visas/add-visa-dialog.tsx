"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createVisaApplication } from "./actions";

// On reçoit la liste des clients pour pouvoir lier le visa à un client existant
export function AddVisaDialog({ clients }: { clients: { id: string, firstName: string, lastName: string }[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await createVisaApplication(new FormData(e.currentTarget));
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground font-semibold">
        <Plus className="mr-2 h-4 w-4" /> Nouveau Dossier
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Nouveau dossier Visa</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select name="clientId" required>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.lastName} {client.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Pays (Destination)</Label>
                <Input id="country" name="country" placeholder="Ex: Espagne" required className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select name="status" required defaultValue="DOC_MANQUANTS">
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DOC_MANQUANTS">Documents manquants</SelectItem>
                    <SelectItem value="EN_ATTENTE_RDV">En attente de RDV</SelectItem>
                    <SelectItem value="DEPOT_FAIT">Dépôt effectué</SelectItem>
                    <SelectItem value="APPROUVE">Approuvé</SelectItem>
                    <SelectItem value="REFUSE">Refusé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="missingDocs">Documents manquants (Optionnel)</Label>
              <Input id="missingDocs" name="missingDocs" placeholder="Ex: Relevé bancaire, Attestation" className="bg-muted/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Date de RDV (VFS/BLS/TLS)</Label>
              <Input id="appointmentDate" name="appointmentDate" type="date" className="bg-muted/50" />
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer le dossier"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}