"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitBooking(offerId: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const passengers = parseInt(formData.get("passengers") as string) || 1;

  // 1. Récupérer l'offre pour vérifier les places et obtenir l'ID de l'agence
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) return { error: "Offre introuvable" };
  
  if (offer.availableSeats !== null && offer.availableSeats < passengers) {
    return { error: `Il ne reste que ${offer.availableSeats} places disponibles.` };
  }

  // 2. Chercher si le client existe déjà dans le CRM de cette agence
  let client = await prisma.client.findFirst({
    where: { phone, agencyId: offer.agencyId }
  });

  // S'il n'existe pas, on le crée
  if (!client) {
    client = await prisma.client.create({
      data: {
        firstName, 
        lastName, 
        phone, 
        email,
        source: "Site Web", // La source automatique
        status: "EN_ATTENTE",
        agencyId: offer.agencyId
      }
    });
  }

  // 3. Créer la réservation
  await prisma.booking.create({
    data: {
      offerId: offer.id,
      clientId: client.id,
      agencyId: offer.agencyId,
      status: "EN_ATTENTE"
    }
  });

  // 4. Mettre à jour le nombre de places restantes dans l'offre
  if (offer.availableSeats !== null) {
    await prisma.offer.update({
      where: { id: offer.id },
      data: { availableSeats: offer.availableSeats - passengers }
    });
  }

  // Rafraîchir les données pour le dashboard
  revalidatePath("/dashboard/offres");
  revalidatePath("/dashboard/clients");
  revalidatePath(`/offre/${offerId}`);

  return { success: true };
}