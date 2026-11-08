import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const offerId = formData.get("offerId") as string;
    const agencyId = formData.get("agencyId") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    // 1. Gérer le client
    let client = await prisma.client.findFirst({
      where: { phone, agencyId }
    });

    if (!client) {
      client = await prisma.client.create({
        data: { firstName, lastName, phone, source: "Site Web", status: "EN_ATTENTE", agencyId }
      });
    }

    // 2. Créer la réservation
    await prisma.booking.create({
      data: { offerId, clientId: client.id, agencyId, status: "EN_ATTENTE" }
    });

    // 3. 🟢 LA NOTIFICATION VOYAGE QUI MANQUAIT !
    try {
      await prisma.notification.create({
        data: {
          title: "Nouvelle Réservation ✈️",
          message: `${firstName} ${lastName} a réservé un voyage.`,
          type: "VOYAGE",
          link: "/dashboard/offres",
          agencyId: agencyId,
        } as any
      });
    } catch (notifError) {
      console.error("Erreur Notification Voyage :", notifError);
    }

    // 4. Redirection vers la page succès
    return NextResponse.redirect(new URL(`/offre/${offerId}?success=true`, request.url));
  } catch (error) {
    console.error("Erreur API Book:", error);
    return NextResponse.redirect(new URL(`/`, request.url));
  }
}