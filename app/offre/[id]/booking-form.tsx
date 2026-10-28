"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitBooking } from "./actions";

export function BookingForm({ offerId, availableSeats }: { offerId: string, availableSeats: number | null }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await submitBooking(offerId, formData);

    if (res?.error) setError(res.error);
    else setSuccess(true);

    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-6 rounded-lg text-center space-y-4 shadow-lg">
        <CheckCircle2 className="w-16 h-16 mx-auto" />
        <h3 className="text-2xl font-bold">Demande envoyée !</h3>
        <p>L'agence a bien reçu votre demande et vous contactera très prochainement pour finaliser votre réservation.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 bg-card p-6 rounded-lg border shadow-lg">
      <h3 className="text-xl font-bold text-primary mb-2">Réserver des places</h3>
      
      {error && <div className="text-destructive font-medium bg-destructive/10 p-3 rounded-md">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Prénom</Label>
          <Input name="firstName" required className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Nom</Label>
          <Input name="lastName" required className="bg-muted/50" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Téléphone (WhatsApp de préférence)</Label>
        <Input name="phone" type="tel" placeholder="Ex: 0555001122" required className="bg-muted/50" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Email (Optionnel)</Label>
          <Input name="email" type="email" className="bg-muted/50" />
        </div>
        <div className="space-y-2">
          <Label>Personnes</Label>
          <Input name="passengers" type="number" min="1" max={availableSeats || 10} defaultValue="1" required className="bg-muted/50" />
        </div>
      </div>

      <Button type="submit" className="w-full font-bold text-primary-foreground text-lg py-6 mt-4" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Confirmer la réservation"}
      </Button>
    </form>
  );
}