"use server";
import prisma from "@/lib/prisma";

export async function submitBooking(agencyId: string, offerId: string, formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string; // 🟢 RESTAURATION DES NOTES

    let client = await prisma.client.findFirst({ where: { phone, agencyId } });
    if (!client) {
      client = await prisma.client.create({
        data: { firstName, lastName, phone, agencyId, source: "Réservation Voyage" },
      });
    }

    const booking = await prisma.booking.create({
      data: {
        clientId: client.id,
        agencyId: agencyId,
        offerId: offerId,
        status: "EN_ATTENTE",
      },
    });

    // 🟢 RESTAURATION DES NOTIFICATIONS POUR L'ADMIN
    await prisma.notification.create({
      data: {
        title: "Nouvelle Réservation",
        message: `${firstName} ${lastName} a réservé un voyage. Remarques: ${notes || "Aucune"}`,
        type: "VOYAGE",
        agencyId: agencyId,
        link: `/dashboard/bookings/${booking.id}`,
      }
    });

    return { success: true, ref: booking.id.slice(-6).toUpperCase() };
  } catch (error) {
    console.error("Erreur Booking:", error);
    return { success: false, error: "Erreur serveur" };
  }
}