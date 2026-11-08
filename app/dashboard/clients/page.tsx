export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import ClientsClient from "./clients-client"; // On importe l'interface

export default async function ClientsPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  // Exactement ta requête d'origine !
  const rawBookings = await prisma.booking.findMany({
    where: { agencyId: agencyId },
    include: { 
      client: true, 
      offer: true 
    },
    orderBy: { createdAt: "desc" },
  });

  const bookings = rawBookings as any[];

  // On envoie les données à ton composant client qui fera la traduction
  return <ClientsClient bookings={bookings} />;
}