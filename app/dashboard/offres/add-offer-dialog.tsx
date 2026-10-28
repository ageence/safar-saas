"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOffer } from "./actions";

export function AddOfferDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await createOffer(new FormData(e.currentTarget));
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground font-semibold">
        <Plus className="mr-2 h-4 w-4" /> Nouvelle Offre
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer une offre de voyage</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'offre</Label>
              <Input id="title" name="title" placeholder="Ex: Séjour Istanbul 7 Nuits" required className="bg-muted/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input id="destination" name="destination" placeholder="Ex: Turquie" required className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select name="type" required defaultValue="VOYAGE">
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VOYAGE">Voyage organisé</SelectItem>
                    <SelectItem value="OMRA">Omra</SelectItem>
                    <SelectItem value="VISA">Dossier Visa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix (DA)</Label>
                <Input id="price" name="price" type="number" required className="bg-muted/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalSeats">Nombre de places</Label>
                <Input id="totalSeats" name="totalSeats" type="number" required className="bg-muted/50" />
              </div>
            </div>
            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Créer l'offre"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}