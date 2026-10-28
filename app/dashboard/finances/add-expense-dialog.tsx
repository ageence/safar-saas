"use client";

import { useState } from "react";
import { MinusCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createExpense } from "./actions";

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await createExpense(new FormData(e.currentTarget));
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)} className="font-semibold">
        <MinusCircle className="mr-2 h-4 w-4" /> Nouvelle Dépense
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enregistrer une dépense</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (DA)</Label>
              <Input id="amount" name="amount" type="number" required className="bg-muted/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select name="category" required defaultValue="BILLETTERIE">
                <SelectTrigger className="bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BILLETTERIE">Billetterie (Vols)</SelectItem>
                  <SelectItem value="HOTEL">Hébergement (Hôtels)</SelectItem>
                  <SelectItem value="VISA">Frais Consulaires (Visas)</SelectItem>
                  <SelectItem value="LOYER">Loyer Agence</SelectItem>
                  <SelectItem value="PUBLICITE">Publicité (Sponsoring)</SelectItem>
                  <SelectItem value="SALAIRES">Salaires</SelectItem>
                  <SelectItem value="AUTRE">Autre dépense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description courte</Label>
              <Input id="description" name="description" placeholder="Ex: Billets Air Algérie groupe Omra" required className="bg-muted/50" />
            </div>

            <Button type="submit" variant="destructive" className="w-full font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enregistrer la dépense"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}