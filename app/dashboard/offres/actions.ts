"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createOffer(formData: FormData) {
  const session = await auth();
  const agencyId = session?.user?.agencyId;
  if (!agencyId) throw new Error("Non autorisé");

  const totalSeats = parseInt(formData.get("totalSeats") as string);

  await prisma.offer.create({
    data: {
      title: formData.get("title") as string,
      destination: formData.get("destination") as string,
      type: formData.get("type") as string,
      price: parseFloat(formData.get("price") as string),
      totalSeats: totalSeats,
      availableSeats: totalSeats, // Au début, toutes les places sont disponibles
      agencyId: agencyId,
    },
  });

  revalidatePath("/dashboard/offres");
}