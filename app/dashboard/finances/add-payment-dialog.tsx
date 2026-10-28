"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createPayment } from "./actions";

type BookingOption = {
  id: string;
  offer: { title: string; price: number };
  client: { firstName: string; lastName: string };
};

export function AddPaymentDialog({ bookings }: { bookings: BookingOption[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await createPayment(new FormData(e.currentTarget));
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-primary text-primary-foreground font-semibold">
        <Plus className="mr-2 h-4 w-4" /> Nouvel Encaissement
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="bookingId">Réservation associée</Label>
              <Select name="bookingId" required>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Sélectionner une réservation" />
                </SelectTrigger>
                <SelectContent>
                  {bookings.map(b => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.client.lastName} {b.client.firstName} - {b.offer.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant (DA)</Label>
              <Input id="amount" name="amount" type="number" required className="bg-muted/50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="method">Méthode de paiement</Label>
                <Select name="method" required defaultValue="ESPECES">
                  <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ESPECES">Espèces</SelectItem>
                    <SelectItem value="VIREMENT">Virement Bancaire</SelectItem>
                    <SelectItem value="BARIDIMOB">BaridiMob</SelectItem>
                    <SelectItem value="CHEQUE">Chèque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reference">Référence (Optionnel)</Label>
                <Input id="reference" name="reference" placeholder="Ex: N° de chèque" className="bg-muted/50" />
              </div>
            </div>

            <Button type="submit" className="w-full font-semibold" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}