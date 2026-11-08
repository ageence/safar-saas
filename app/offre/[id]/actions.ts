"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitBooking(offerId: string, formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const passengers = parseInt(formData.get("passengers") as string) || 1;

  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) return { error: "Offre introuvable" };
  if (offer.availableSeats !== null && offer.availableSeats < passengers) return { error: `Places insuffisantes.` };

  let client = await prisma.client.findFirst({ where: { phone, agencyId: offer.agencyId } });

  if (!client) {
    client = await prisma.client.create({
      data: { firstName, lastName, phone, email, source: "Site Web", status: "EN_ATTENTE", agencyId: offer.agencyId }
    });
  }

  await prisma.booking.create({
    data: { offerId: offer.id, clientId: client.id, agencyId: offer.agencyId, status: "EN_ATTENTE" }
  });

  if (offer.availableSeats !== null) {
    await prisma.offer.update({
      where: { id: offer.id }, data: { availableSeats: offer.availableSeats - passengers }
    });
  }

  // 🟢 ON SÉPARE LA NOTIFICATION POUR ÉVITER LES CRASHES
  try {
    await prisma.notification.create({
      data: {
        title: "Nouvelle Réservation Voyage ✈️",
        message: `${firstName} ${lastName} a réservé ${passengers} place(s).`,
        type: "VOYAGE", link: "/dashboard/offres", agencyId: offer.agencyId,
      } as any
    });
  } catch (error) { console.error("Notification échouée", error); }

  revalidatePath("/dashboard/offres");
  revalidatePath("/dashboard/clients");
  revalidatePath(`/offre/${offerId}`);

  return { success: true };
}