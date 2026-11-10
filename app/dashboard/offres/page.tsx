export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import OffresClient from "./offres-client";

// ACTION SERVEUR INTACTE
async function deleteOfferAction(formData: FormData) {
  "use server"
  const offerId = formData.get("offerId") as string;
  try {
    await prisma.booking.deleteMany({ where: { offerId } }).catch(() => {});
    await prisma.offer.delete({ where: { id: offerId } });
    revalidatePath("/dashboard/offres");
  } catch(e) { console.error("Erreur de suppression", e); }
}

export default async function OffersPage() {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) return null;

  const rawOffers = await prisma.offer.findMany({
    where: { agencyId },
    orderBy: { createdAt: "desc" },
  });
  const offers = rawOffers as any[];

  return <OffresClient offers={offers} deleteOfferAction={deleteOfferAction} />;
}