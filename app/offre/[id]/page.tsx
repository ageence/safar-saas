export const instant = false;
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { MapPin, Users, PlaneTakeoff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BookingForm } from "./booking-form";

// Cette page est publique, pas besoin de session !
export default async function PublicOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // On cherche l'offre ET les infos de l'agence qui l'a publiée
  const offer = await prisma.offer.findUnique({
    where: { id },
    include: { agency: true }
  });

  if (!offer) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Barre de navigation simple de l'agence */}
      <header className="border-b bg-card py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <PlaneTakeoff className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">{offer.agency.name}</h1>
        </div>
        {offer.agency.phone && (
          <span className="text-sm font-medium text-muted-foreground hidden sm:block">
            Assistance: {offer.agency.phone}
          </span>
        )}
      </header>

      <main className="max-w-5xl mx-auto mt-8 px-4 grid md:grid-cols-2 gap-10">
        
        {/* Colonne Gauche : Détails de l'offre */}
        <div className="space-y-6">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none px-4 py-1 text-sm">
            {offer.type}
          </Badge>
          
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">{offer.title}</h2>

          <div className="flex flex-col gap-4 text-muted-foreground mt-6">
            <div className="flex items-center gap-3">
              <MapPin className="text-primary w-6 h-6" />
              <span className="text-lg">Destination : {offer.destination}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="text-primary w-6 h-6" />
              <span className="text-lg">Places disponibles : {offer.availableSeats}</span>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg border shadow-sm mt-8 border-l-4 border-l-primary">
            <div className="text-sm text-muted-foreground uppercase font-bold tracking-wider mb-2">Tarif par personne</div>
            <div className="text-5xl font-black text-foreground">
              {new Intl.NumberFormat("fr-DZ").format(offer.price)} <span className="text-2xl text-primary">DA</span>
            </div>
          </div>
        </div>

        {/* Colonne Droite : Formulaire de réservation */}
        <div>
          {offer.availableSeats !== null && offer.availableSeats > 0 ? (
            <BookingForm offerId={offer.id} availableSeats={offer.availableSeats} />
          ) : (
            <div className="bg-destructive/10 border border-destructive/20 p-8 rounded-lg text-center h-full flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-destructive">Offre Complète</h3>
              <p className="text-muted-foreground mt-2">Désolé, il n'y a plus de places pour cette offre.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}