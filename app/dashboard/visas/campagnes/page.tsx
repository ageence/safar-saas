export const instant = false;

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { CampagnesClient } from "./campagnes-client";

async function createVisaOfferAction(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.agencyId) return;

  const title = formData.get("title") as string;
  const country = formData.get("country") as string;
  
  const agencyName = (session.user.name || "agence").toLowerCase().replace(/[^a-z0-9]/g, '-');
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const slug = `${agencyName}-${cleanTitle}-${Math.floor(Math.random() * 1000)}`;

  await prisma.visaOffer.create({
    data: { title, country: country || null, slug, agencyId: session.user.agencyId } as any
  });
  revalidatePath("/dashboard/visas/campagnes");
}

async function deleteVisaOfferAction(id: string) {
  "use server";
  await prisma.visaOffer.delete({ where: { id } });
  revalidatePath("/dashboard/visas/campagnes");
}

export default async function CampagnesVisaAdmin() {
  const session = await auth();
  if (!session?.user?.agencyId) return null;

  const offres = await prisma.visaOffer.findMany({
    where: { agencyId: session.user.agencyId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <CampagnesClient 
      offres={offres} 
      createVisaOfferAction={createVisaOfferAction} 
      deleteVisaOfferAction={deleteVisaOfferAction} 
    />
  );
}