import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const formData = await request.formData();
  const offerId = formData.get("offerId") as string;
  
  try {
    const agencyId = formData.get("agencyId") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const phone = formData.get("phone") as string;

    // 1. On crée le Client dans ton agence (AVEC LE CHAMP SOURCE !)
    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        phone,
        agencyId,
        source: "SITE WEB", // <--- LE CORRECTIF EST LÀ !
      } as any
    });

    // 2. On crée la Réservation (Booking)
    await prisma.booking.create({
      data: {
        clientId: client.id,
        offerId: offerId,
        agencyId: agencyId,
      } as any
    });

    // 3. Redirection FORCÉE vers la page Merci !
    return NextResponse.redirect(new URL(`/offre/${offerId}?success=true`, request.url), 303);

  } catch (error: any) {
    console.error("Erreur Réservation:", error);
    // Le fameux cadre rouge qui s'affiche s'il manque encore un champ !
    return NextResponse.redirect(new URL(`/offre/${offerId}?error=${encodeURIComponent(error.message)}`, request.url), 303);
  }
}