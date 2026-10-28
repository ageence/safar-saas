"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "./actions";

export function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fonction appelée quand on clique sur "Enregistrer"
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    
    // On envoie les données du formulaire à notre Server Action
    const formData = new FormData(e.currentTarget);
    await createClient(formData);
    
    setLoading(false);
    setOpen(false); // On ferme la fenêtre
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
   <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Ajouter un client
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouveau Prospect</DialogTitle>
          <DialogDescription>
            Saisissez les coordonnées du client pour l'ajouter au CRM.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input id="firstName" name="firstName" required className="bg-muted/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input id="lastName" name="lastName" required className="bg-muted/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone (WhatsApp)</Label>
            <Input id="phone" name="phone" placeholder="Ex: 0555001122" required className="bg-muted/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source du contact</Label>
            <Select name="source" required defaultValue="WhatsApp">
              <SelectTrigger className="bg-muted/50">
                <SelectValue placeholder="Sélectionnez une source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
                <SelectItem value="Site Web">Site Web</SelectItem>
                <SelectItem value="Recommandation">Recommandation</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full font-semibold" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enregistrer"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}