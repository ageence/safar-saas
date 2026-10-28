import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { PlaneTakeoff, MapPin, Users, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { AddOfferDialog } from "./add-offer-dialog";

export default async function OffersPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;

  if (!agencyId) return null;

  const offers = await prisma.offer.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offres & Voyages</h1>
          <p className="text-muted-foreground">
            Gérez vos forfaits, séjours Omra et visas.
          </p>
        </div>
        <AddOfferDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offers.length === 0 ? (
          <div className="col-span-full p-8 text-center border rounded-md border-dashed text-muted-foreground">
            Aucune offre pour le moment.
          </div>
        ) : (
          offers.map((offer) => (
     <Card key={offer.id} className="bg-card hover:border-primary/50 transition-colors flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {offer.type}
                  </Badge>
                  <span className="font-bold text-lg text-primary">
                    {new Intl.NumberFormat("fr-DZ").format(offer.price)} DA
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-1">{offer.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-2 text-sm text-muted-foreground flex-1">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {offer.destination}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {offer.availableSeats} places restantes (sur {offer.totalSeats})
                </div>
              </CardContent>

              {/* LE NOUVEAU BOUTON EST ICI */}
              <CardFooter className="pt-4 border-t border-border/50">
                <a href={`/offre/${offer.id}`} target="_blank" rel="noreferrer" className={buttonVariants({ variant: "outline" }) + " w-full text-primary hover:text-primary hover:bg-primary/10"}>
                  Voir la page publique
                </a>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}